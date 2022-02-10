# Algarve Residential mobile App

[![Screen Shot 2022-02-10 at 13 43 44](https://user-images.githubusercontent.com/992049/153454832-3cd39190-1f02-449a-92da-b2ac7a940d0a.png)](https://www.youtube.com/watch?v=3LwJyKJN6_Q "Click to watch the app demonstration on Youtube")

Developed using mobile technologies for Android and iOS

*** This app is published at Google Play store at https://play.google.com/store/apps/details?id=br.com.residencialalgarve ***

It is intended to be used only by Algarve Residential's residents, but can be customized for any condominium.

**Frontend**: Webbiew using Ionic and Capacitor (I also have a React Native version in development)
 - Light and Darks themes
 - Per user/resident authentication
 - Users can read the news about his condominium with multiples pictures and gives him a like ❤️. When apps load, it loads the last 10 news, when user scroll the screen more news will be lazy loaded from backend. 
 - The manager can add, edit and exclude news.
 - Residents can book the party room choosign the date and period (day, afternoon, evening) (taxes are applicable).
 - Residents can see a list and search for others residents and contact him (if they allow).
 - Residents can read and download legal condominium documents through app.

**Backend**: Firebase  using technologies like:
 - Firestore: NoSQL Database
 - Firestorage: for user images, news images and documents storage
 - Cloud Functions: Calculate taxes for user bookings, send reports to manager at end of the month, send residents gas bill consumption...
 - Push Notifications: User receive notifications from manager for news, the manager receive notifications when residents booking the party room, etc.
 - Crashlytics: Error and bugging monitor.
 
### Screenshots:

![localhost_8100_login(Nexus 5X)](https://user-images.githubusercontent.com/992049/153454234-689a738f-4517-4b45-adb4-546019708128.png)

![localhost_8100_tabs_home(Nexus 5X)](https://user-images.githubusercontent.com/992049/153454060-1f8ad2d5-5482-4a64-a9fa-918c7870b8ee.png)

![localhost_8100_tabs_home(Nexus 5X) (1)](https://user-images.githubusercontent.com/992049/153454010-2151a4c1-2ae2-48ea-b6df-64b890a1b699.png)

![localhost_8100_tabs_home(Nexus 5X) (2)](https://user-images.githubusercontent.com/992049/153454076-7631d2f8-db48-49a7-9159-35a93cf21ab2.png)

![localhost_8100_tabs_home(Nexus 5X) (3)](https://user-images.githubusercontent.com/992049/153454074-78cb3246-4850-440c-89c9-ef913e34efe3.png)

![localhost_8100_tabs_home(Nexus 5X) (4)](https://user-images.githubusercontent.com/992049/153454073-7f183a61-2783-4d5e-9f83-31c6bef72a11.png)

![localhost_8100_tabs_home(Nexus 5X) (5)](https://user-images.githubusercontent.com/992049/153454069-53add432-e68c-4498-b846-d6d6955cc983.png)




