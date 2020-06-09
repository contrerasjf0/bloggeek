$(() => {
  $('.tooltipped').tooltip({ delay: 50 });
  $('.modal').modal();

  // Init Firebase nuevamente
  firebase.initializeApp(firebaseConfig);

  navigator.serviceWorker
    .register('../notificaciones-sw.js')
    .then(registro => {
      console.log('service worker was registred');
      firebase.messaging().useServiceWorker(registro);
    })
    .catch(error => {
      console.error(`Error to register the service worker => ${error}`);
    });

    const messaging = firebase.messaging();

  // Registrar credenciales web
  messaging.usePublicVapidKey('BMzeoSHtJkMEFYxLRePeS3Qq323Vw7E_59zg7IyWlphwgOQGq3PYwlT0use_qOTtQxHS3L5JVpYT8loc7vLntSk');

  // Solicitar permisos para las notificaciones
  messaging
    .requestPermission()
    .then(() => {
      console.log('permits granted');
      return messaging.getToken();
    })
    .then(token => {
      const db = firebase.firestore();
      
      db.collection('tokens')
        .doc(token)
        .set({
          token: token
        })
        .catch(error => {
          console.error(`Error to insert the token to the DB => ${error}`);
        });
    });

// Obtener el token cuando se refresque

    messaging.onTokenRefresh(() => {

      messaging.getToken()
          .then(token => {
            const db = firebase.firestore();
      
            db.collection('tokens')
              .doc(token)
              .set({
                token: token
              })
              .catch(error => {
                console.error(`Error to insert the token to the DB => ${error}`);
              });
          });

    });


  // Recibir las notificaciones cuando el usuario esta foreground

  messaging.onMessage(payload => {
    Materialize.toast(`Ya tenemos un nuevo post. Revisalo, se llama ${payload.data.title}`, 6000);
  })

  // TODO: Recibir las notificaciones cuando el usuario esta background

  const post = new Post();
  post.getAllPost();

  // TODO: Firebase observador del cambio de estado
firebase.auth().onAuthStateChanged(user => {
    if (user) {
      $('#btnInicioSesion').text('Salir');
      if (user.photoURL) {
        $('#avatar').attr('src', user.photoURL);
      } else {
        $('#avatar').attr('src', 'imagenes/usuario_auth.png');
      }
    } else {
      $('#btnInicioSesion').text('Iniciar Sesión');
      $('#avatar').attr('src', 'imagenes/usuario.png');
    }
  })
  //$('#btnInicioSesion').text('Salir')
  //$('#avatar').attr('src', user.photoURL)
  //$('#avatar').attr('src', 'imagenes/usuario_auth.png')
  //$('#btnInicioSesion').text('Iniciar Sesión')
  //$('#avatar').attr('src', 'imagenes/usuario.png')

  // TODO: Evento boton inicio sesion
  $('#btnInicioSesion').click(() => {
    
    const user = firebase.auth().currentUser;

    if (user) {
      $('#btnInicioSesion').text('Iniciar Sesión');

      return firebase
        .auth()
        .signOut()
        .then(() => {
          $('#avatar').attr('src', 'imagenes/usuario.png');
          Materialize.toast(`SignOut Correcto`, 4000);
        })
        .catch(error => {
          Materialize.toast(`Error al realizar SignOut => ${error}`, 4000);
        });
    }

    $('#emailSesion').val('')
    $('#passwordSesion').val('')
    $('#modalSesion').modal('open')
  })

  $('#avatar').click(() => {
      firebase
        .auth()
        .signOut()
        .then(() => {
          $('#avatar').attr('src', 'imagenes/usuario.png')
          Materialize.toast(`SignOut correcto`, 4000)
        }).catch(error =>{
          Materialize.toast(`Error al realizar SignOut ${error}`, 4000)
        });

  })

  $('#btnTodoPost').click(() => {
    $('#tituloPost').text('Posts de la Comunidad');
    const post = new Post();
    post.getAllPost();
  })

  $('#btnMisPost').click(() => {
    const user = firebase.auth().currentUser;

    if (user) {
      
      const post = new Post();
      
      post.getPostByUser(user.email);
      
      $('#tituloPost').text('Mis Posts');

    } else {

      Materialize.toast(`Debes estar autenticado para ver tus posts`, 4000)

    }

  })
})
