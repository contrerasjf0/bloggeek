$(() => {
  $('#btnModalPost').click(() => {
    $('#tituloNewPost').val('')
    $('#descripcionNewPost').val('')
    $('#linkVideoNewPost').val('')
    $('#btnUploadFile').val('')
    $('.determinate').attr('style', `width: 0%`)
    sessionStorage.setItem('imgNewPost', null)

    // TODO: Validar que el usuario esta autenticado

    // Materialize.toast(`Para crear el post debes estar autenticado`, 4000)

    $('#modalPost').modal('open')
  })

  $('#btnRegistroPost').click(() => {

    const post = new Post();
    const user = firebase.auth().currentUser;

    if(user == null){
      Materialize.toast(`To create the post you have to be authenticated`, 4000);
      return;
    }

    

    const title = $('#tituloNewPost').val();
    const description = $('#descripcionNewPost').val();
    const videoLink = $('#linkVideoNewPost').val();
    const imgLink = sessionStorage.getItem('imgNewPost') == 'null'
      ? null
      : sessionStorage.getItem('imgNewPost');

    post
      .crearPost(
        user.uid,
        user.email,
        title,
        description,
        imgLink,
        videoLink
      )
      .then(resp => {
        Materialize.toast(`The Post was created`, 4000)
        $('.modal').modal('close')
      })
      .catch(err => {
        Materialize.toast(`Error => ${err}`, 4000)
      });
  });

  $('#btnUploadFile').on('change', e => {
    const file = e.target.files[0];
    const user = firebase.auth().currentUser;
    const post = new Post();
    post.uploadPostImage(file, user.uid);
  });
})
