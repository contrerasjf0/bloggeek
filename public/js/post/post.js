class Post {
  constructor () {
    this.db = firebase.firestore();

  }

  crearPost (uid, userEmail, title, description, imgLink, videoLink) {
    return this.db
                .collection('posts')
                .add({
                    uid,
                    author: userEmail,
                    title,
                    description,
                    imgLink,
                    videoLink,
                    date: firebase.firestore.FieldValue.serverTimestamp()
                })
                .then(refDoc => {
                    console.log(`Post Id=> ${refDoc.id}`);
                })
                .catch(error => {
                    console.error(`Error to create post => ${error}`);
                });
  }

  getAllPost () {
    this.db.collection('posts')
        .onSnapshot(querySnapshot => {
            $('#posts').empty();
            
            if (querySnapshot.empty) {
                $('#posts').append(this.getTemplateEmptyPost());
            } else {
                querySnapshot.forEach(post => {
                    let postHtml = this.getPostTemplate(
                                post.data().author,
                                post.data().title,
                                post.data().description,
                                post.data().videoLink,
                                post.data().imagLink,
                                Utilidad.getDate(post.data().date.toDate())
                            );
                $('#posts').append(postHtml);
          })
        }
      });
  }

  getPostByUser (userEmail) {
    this.db.collection('posts')
        .where('author', '==', userEmail)
        .onSnapshot(querySnapshot => {
            $('#posts').empty();
            
            if (querySnapshot.empty) {
                $('#posts').append(this.getTemplateEmptyPost());
            } else {
                querySnapshot.forEach(post => {
                    let postHtml = this.getPostTemplate(
                                post.data().author,
                                post.data().title,
                                post.data().description,
                                post.data().videoLink,
                                post.data().imagLink,
                                Utilidad.getDate(post.data().date.toDate())
                            );
                $('#posts').append(postHtml);
          })
        }
      });
  }

  getTemplateEmptyPost () {
    return `<article class="post">
      <div class="post-titulo">
          <h5>Crea el primer Post a la comunidad</h5>
      </div>
      <div class="post-calificacion">
          <a class="post-estrellita-llena" href="*"></a>
          <a class="post-estrellita-llena" href="*"></a>
          <a class="post-estrellita-llena" href="*"></a>
          <a class="post-estrellita-llena" href="*"></a>
          <a class="post-estrellita-vacia" href="*"></a>
      </div>
      <div class="post-video">
          <iframe type="text/html" width="500" height="385" src='https://www.youtube.com/embed/bTSWzddyL7E?ecver=2'
              frameborder="0"></iframe>
          </figure>
      </div>
      <div class="post-videolink">
          Video
      </div>
      <div class="post-descripcion">
          <p>Crea el primer Post a la comunidad</p>
      </div>
      <div class="post-footer container">         
      </div>
  </article>`
  }

  getPostTemplate (
    author,
    title,
    description,
    videoLink,
    imgLink,
    date
  ) {
    if (imgLink) {
      return `<article class="post">
            <div class="post-titulo">
                <h5>${title}</h5>
            </div>
            <div class="post-calificacion">
                <a class="post-estrellita-llena" href="*"></a>
                <a class="post-estrellita-llena" href="*"></a>
                <a class="post-estrellita-llena" href="*"></a>
                <a class="post-estrellita-llena" href="*"></a>
                <a class="post-estrellita-vacia" href="*"></a>
            </div>
            <div class="post-video">                
                <img id="imgVideo" src='${imgLink}' class="post-imagen-video" 
                    alt="Imagen Video">     
            </div>
            <div class="post-videolink">
                <a href="${videoLink}" target="blank">Ver Video</a>                            
            </div>
            <div class="post-descripcion">
                <p>${description}</p>
            </div>
            <div class="post-footer container">
                <div class="row">
                    <div class="col m6">
                        Fecha: ${date}
                    </div>
                    <div class="col m6">
                        Autor: ${author}
                    </div>        
                </div>
            </div>
        </article>`
    }

    return `<article class="post">
                <div class="post-titulo">
                    <h5>${title}</h5>
                </div>
                <div class="post-calificacion">
                    <a class="post-estrellita-llena" href="*"></a>
                    <a class="post-estrellita-llena" href="*"></a>
                    <a class="post-estrellita-llena" href="*"></a>
                    <a class="post-estrellita-llena" href="*"></a>
                    <a class="post-estrellita-vacia" href="*"></a>
                </div>
                <div class="post-video">
                    <iframe type="text/html" width="500" height="385" src='${videoLink}'
                        frameborder="0"></iframe>
                    </figure>
                </div>
                <div class="post-videolink">
                    Video
                </div>
                <div class="post-descripcion">
                    <p>${description}</p>
                </div>
                <div class="post-footer container">
                    <div class="row">
                        <div class="col m6">
                            Fecha: ${date}
                        </div>
                        <div class="col m6">
                            Autor: ${author}
                        </div>        
                    </div>
                </div>
            </article>`
  }
}
