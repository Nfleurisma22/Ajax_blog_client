window.addEventListener('load', event => {

  console.log('Ajax Blog Client: ready to AJAXX!');

  const baseURL = 'http://localhost:3001/api/blogposts/';
  const newPostButtonEl = document.getElementById('new-post');
  const allPostsEl = document.getElementById('all-posts');
  const postsListEl = document.createElement('ul');
  allPostsEl.appendChild(postsListEl);
  const focusPostEl = document.getElementById('focus-post');

  const deletePost = id => {
    axios.delete(`${baseURL}${id}`)
      .then(result => {
        focusPostEl.innerHTML = '';
        setTimeout(getAllPosts, 500);
      })
      .catch(error => { console.error(error); });
  }

  const updatePost = (event, id) => {
    const newTitle = document.getElementById('edit-post-title').value;
    const newContent = document.getElementById('edit-post-content').value;
    const newData = { title: newTitle, content: newContent };
    axios.put(`${baseURL}${id}`, newData)
      .then(result => {
        let update_id = result.data.id;
        focusPostEl.innerHTML = '';
        setTimeout(() => {
          getAllPosts();
          getOnePost(update_id);
        }, 500);
      })
      .catch(error => { console.error(error); });
    event.preventDefault();
  }

  const editPost = blogpost => {
    focusPostEl.innerHTML = '';
    const editPostFormEl = document.createElement('form');
    editPostFormEl.innerHTML = `
      <h4>Edit post.</h4>
      <label>Title</label>
      <input type='text' id='edit-post-title' value='${blogpost.title}' />
      <br><br>
      <label>Content</label>
      <textarea id='edit-post-content'>${blogpost.content}</textarea>
      <br><br>
      <button id='update-post'>Update.</button>`;
    focusPostEl.appendChild(editPostFormEl);
    document.getElementById('update-post').addEventListener('click', (event) => {
      event.preventDefault();
      updatePost(event, blogpost.id);
    });
  }

  const getOnePost = id => {
    axios.get( `${baseURL}${id}`)
      .then( response => {
        focusPostEl.innerHTML = '';
        const postTitleEl = document.createElement('h3');
        postTitleEl.innerHTML = response.data.title;
        const postContentEl = document.createElement('p');
        postContentEl.innerHTML = response.data.content;
        focusPostEl.appendChild(postTitleEl);
        focusPostEl.appendChild(postContentEl);
        const editButtonEl = document.createElement('button');
        editButtonEl.innerHTML = 'Edit.';
        editButtonEl.id = 'edit-post-button';
        focusPostEl.appendChild(editButtonEl);
        const deleteButtonEl = document.createElement('button');
        deleteButtonEl.innerHTML = 'Delete.';
        deleteButtonEl.id = 'delete-post-button';
        focusPostEl.appendChild(deleteButtonEl);
        editButtonEl.addEventListener('click', () => { editPost(response.data); });
        deleteButtonEl.addEventListener('click', () => { deletePost(response.data.id); });
       })
      .catch( error => { console.error(error); });
  }

  const createPost = event => {
    const title = document.getElementById('new-post-title').value;
    const content = document.getElementById('new-post-content').value;
    axios.post(`${baseURL}`, { title, content })
      .then( response => {
        getAllPosts();
        getOnePost(response.data.id);
      })
      .catch( error => { console.error( error ); });
    event.preventDefault();
  }

  const newPost = () => {
    const newPostFormEl = document.createElement('form');
    newPostFormEl.innerHTML = `<h4>New post.</h4>
      <label>Title</label>
      <input type='text' id='new-post-title' />
      <br><br>
      <label>Content</label>
      <textarea id='new-post-content'></textarea>
      <br><br>
      <button id='create-post'>Submit.</button>`;
    focusPostEl.innerHTML = '';
    focusPostEl.appendChild(newPostFormEl);
    document.getElementById('create-post').addEventListener('click', createPost);
  }

  const getAllPosts = () => {
    axios.get( baseURL )
      .then( response => {
        postsListEl.innerHTML = '';
        response.data.forEach( item => {
          let postListItemEl = document.createElement('li');
          postListItemEl.innerHTML = item.title;
          postListItemEl.addEventListener('click', id => { getOnePost(item.id); });
          postsListEl.appendChild(postListItemEl);
        })
      })
      .catch( error => { console.error(error); });
  }

  newPostButtonEl.addEventListener('click', newPost);
  getAllPosts();

});
