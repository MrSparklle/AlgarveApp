import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take, tap } from 'rxjs/operators';
import { Platform } from '@ionic/angular';
import { Resources } from './core/utils/resources';
import {
  Filesystem,
  Directory,
  Encoding,
  MkdirOptions,
  WriteFileResult,
} from '@capacitor/filesystem';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private http: HttpClient, private platform: Platform) {}

  async saveFileOnDisk(
    fileName: string,
    fileBlob: HttpResponse<Blob>
  ): Promise<WriteFileResult> {
    console.log('vou criar o diretorio');

    // criando diretório para salvar o arquivo baixado
    this.initFolder(Resources.Constants.DOWNLOAD_FOLDER);

    if (this.platform.is('capacitor') || this.platform.is('electron')) {
      await this.convertToBase64Chunks(
        fileBlob.body,
        6,
        async (value: string, first: boolean): Promise<void> => {
          if (first) {
            await Filesystem.writeFile({
              path: Resources.Constants.DOWNLOAD_FOLDER + '/' + fileName,
              directory: Directory.ExternalStorage,
              data: value,
            });
          } else {
            await Filesystem.appendFile({
              path: Resources.Constants.DOWNLOAD_FOLDER + '/' + fileName,
              directory: Directory.ExternalStorage,
              data: value,
            });
          }
        }
      );
    } else {
      // gravando o arquivo baixado no dispositivo do usuário.
      return await Filesystem.writeFile({
        path: Resources.Constants.DOWNLOAD_FOLDER + '/' + fileName,
        directory: Directory.ExternalStorage,
        data: fileBlob.body as any,
        encoding: Encoding.UTF8,
      });
    }
  }

  // realiza download do arquivo passado na URL como parametro e salva no dispositivo do usuario
  // retorna string com o local/arquivo salvo
  async downloadFile(url: string): Promise<{
    fileBlob: HttpResponse<Blob>;
    fileName: string;
  }> {
    let fileName = 'undefined.pdf';

    // montando header da requisição http para download
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/pdf',
      }),
      responseType: 'blob' as 'blob',
      observe: 'response' as 'response',
    };

    // realizar a requisição http para efetuar o download do arquivo
    const fileBlob = await this.http
      .get(url, httpOptions)
      .pipe(
        take(1),
        tap((res) => (fileName = this.getFileNameFromResponse(res.headers)))
      )
      .toPromise();

    return { fileBlob, fileName };
  }
  private async initFolder(folderName: string): Promise<void> {
    try {
      return await Filesystem.mkdir({
        path: folderName,
        directory: Directory.ExternalStorage,
        recursive: false, // like mkdir -p
      });
    } catch (e) {
      // se o diretorio ja existir, ignora o error e continua
      console.log(e.message, folderName);
    }
  }

  // recupera o nome do arquivo retornado no header do response de download
  private getFileNameFromResponse(res: HttpHeaders): string {
    const contentDisposition = res.get('content-disposition');

    const regex =
      /filename[^;=\n]*=(?:(\\?['"])(.*?)\1|(?:[^\s]+'.*?')?([^;\n]*))/i;
    const matches = regex.exec(contentDisposition);

    return matches[3] || 'undefined.pdf';
  }

  // https://github.com/digaus/CapacitorSaveBlob
  private async convertToBase64Chunks(
    blob: Blob,
    size: number,
    chunk: (value: string, first?: boolean) => Promise<void>
  ): Promise<void> {
    const chunkSize: number = 1024 * 1024 * size;
    if (chunkSize % 6) {
      throw new Error('Chunksize must be a multiple of 6!');
    } else {
      const blobSize: number = blob.size;
      while (blob.size > chunkSize) {
        const value: string = await this.convertToBase64(
          blob.slice(0, chunkSize)
        );
        await chunk(
          blobSize === blob.size ? value : value.split(',')[1],
          blobSize === blob.size
        );
        blob = blob.slice(chunkSize);
      }
      const lastValue: string = await this.convertToBase64(
        blob.slice(0, blob.size)
      );
      await chunk(lastValue.split(',')[1], blobSize === blob.size);
      blob = blob.slice(blob.size);
    }
  }

  // https://github.com/digaus/CapacitorSaveBlob
  private convertToBase64(blob: Blob): Promise<string> {
    return new Promise(
      (resolve: (base64: string) => void, reject: () => void): void => {
        let reader: FileReader = new FileReader();
        const realFileReader: FileReader = reader['_realReader'];
        if (realFileReader) {
          reader = realFileReader;
        }
        reader.onerror = (err: any): void => {
          console.log(err);
          reject();
        };
        reader.onload = (): void => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(blob);
      }
    );
  }
}
