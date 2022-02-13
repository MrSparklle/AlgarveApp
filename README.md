# Algarve Residential App

A production ready mobile app developed using modern technologies for Android and iOS


[![Screen Shot 2022-02-10 at 13 43 44](https://user-images.githubusercontent.com/992049/153454832-3cd39190-1f02-449a-92da-b2ac7a940d0a.png)](https://www.youtube.com/watch?v=3LwJyKJN6_Q "Click to watch the app demonstration on Youtube")

*** This app is published at Google Play store at https://play.google.com/store/apps/details?id=br.com.residencialalgarve ***

It is intended to be used only by Algarve Residential's residents, but can be customized for any condominium.

**Frontend**: Webbiew using Ionic and Capacitor (I also have a React Native version in development)
 - Light and Dark themes
 - Per user/resident authentication
 - Users can read the news about his condominium with multiples pictures and gives it a like ❤️. When app loads, it load the last 10 news, when user scrolls more news will be lazy loaded from backend. 
 - The manager can add, edit and delete news.
 - Residents can book the party room by choosign the date and period (day, afternoon, evening) (taxes are applicable).
 - Residents can view and search for others residents and contact them (if they allow).
 - Residents can read and download legal condominium documents through app.

**Backend**: Firebase  using technologies like:
 - Firestore: NoSQL Database
 - Firestorage: user pictures, news pictures and document storage
 - Cloud Functions: Calculate user bookings taxes, send manager reports at end of the month, send residents gas consumption bill...
 - Push Notifications: User receive notifications about new news, the manager receive notifications when residents booking the party room...
 - Crashlytics: Error and bugging monitor.
 
### Screenshots:

![localhost_8100_login(Nexus 5X)](https://user-images.githubusercontent.com/992049/153454234-689a738f-4517-4b45-adb4-546019708128.png)

![localhost_8100_tabs_home(Nexus 5X)](https://user-images.githubusercontent.com/992049/153454060-1f8ad2d5-5482-4a64-a9fa-918c7870b8ee.png)

![localhost_8100_tabs_home(Nexus 5X) (1)](https://user-images.githubusercontent.com/992049/153454010-2151a4c1-2ae2-48ea-b6df-64b890a1b699.png)

![localhost_8100_tabs_home(Nexus 5X) (2)](https://user-images.githubusercontent.com/992049/153454076-7631d2f8-db48-49a7-9159-35a93cf21ab2.png)

![localhost_8100_tabs_home(Nexus 5X) (3)](https://user-images.githubusercontent.com/992049/153454074-78cb3246-4850-440c-89c9-ef913e34efe3.png)

![localhost_8100_tabs_home(Nexus 5X) (4)](https://user-images.githubusercontent.com/992049/153454073-7f183a61-2783-4d5e-9f83-31c6bef72a11.png)

![localhost_8100_tabs_home(Nexus 5X) (5)](https://user-images.githubusercontent.com/992049/153454069-53add432-e68c-4498-b846-d6d6955cc983.png)




