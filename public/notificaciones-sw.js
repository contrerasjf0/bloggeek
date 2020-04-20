importScripts('https://www.gstatic.com/firebasejs/6.2.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/6.2.0/firebase-messaging.js')

firebase.initializeApp({
    projectId: "blogeek-d1979",
    messagingSenderId: "118071577914",
});


const messaging = firebase.messaging();

messaging.setBackgroundMessaheHandler( payload => {
    const notificationTitle = 'Ya tenemos un nuevo post';
    const notificationOptions = {
        body: payload.data.title,
        icon: 'icon/icon_new_post.png',
        click_actio: 'https://blogeek-d1979.firebaseapp.com/'
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});