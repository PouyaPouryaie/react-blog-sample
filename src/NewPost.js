import React from 'react'
import { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import { format } from 'date-fns';
import api from './api/posts';
import DataContext from './context/DataContext';

const NewPost = () => {

  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const { posts, setPosts } = useContext(DataContext);

  /*
    to serve component instead of requesting anyting from server,
    we are serving the component that is routed to home directory by using browser history
    the reason, we use to '/posts' as endpoint is we create json-server and the name of the object is defined posts 
  */
  const history = useHistory();

  const handleSubmit = async(e) => {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const newPost = { id, title: postTitle, datetime, body: postBody };
    try {
      const response = await api.post('/posts', newPost);
      const allPosts = [ ...posts, response.data ];
      setPosts(allPosts);
      setPostTitle('');
      setPostBody('');
      history.push('/');
    } catch(err) {
      console.log(`Error: ${err.message}`);
    }

}

  return (
    <main className='NewPost'>
        <h2>New Post</h2>
        <form className='newPostForm' onSubmit={handleSubmit}>
          <label htmlFor='postTitle'>Title:</label>
          <input
            id="postTitle"
            type='text'
            required
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
          />
          <label htmlFor='postBody'>Post:</label>
          <textarea
            id="postbody"
            required
            value={postBody}
            onChange={(e) => setPostBody(e.target.value)}
          />
          <button type='submit'>Submit</button>
        </form>
    </main>
  )
}

export default NewPost