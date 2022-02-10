import { Profile } from './profile.interface';
export interface Notices {
  id: string;
  dateCreated: string;
  dateUpdated: string;
  from: {
    id: string;
    suite: number;
    status: string;
  };
  to: {
    id: string;
  };
  likeCount: number;
  title: string;
  like?: { liked: boolean };
  text: string;
  imgUrl: string[];
  profile?: Profile;
}
