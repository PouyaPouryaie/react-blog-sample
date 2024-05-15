import React from 'react'
import { useEffect, useContext, useState } from 'react'
import { useParams, Link, useHistory } from 'react-router-dom'
import { format } from 'date-fns';
import api from './api/posts';
import DataContext from './context/DataContext';

const EditPost = () => {

  const {  posts, setPosts } = useContext(DataContext);

  const {id} = useParams();
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');

  /*
    to serve component instead of requesting anyting from server,
    we are serving the component that is routed to home directory by using browser history
    the reason, we use to '/posts' as endpoint is we create json-server and the name of the object is defined posts 
  */
  const history = useHistory();

  // because useParams method is going to fectch as a String, to compare we need to cast post.id to string
  const post = posts.find(post => (post.id).toString() === id);

  useEffect( () => {
    if(post) {
      setEditTitle(post.title);
      setEditBody(post.body);
    }
  }, [post, setEditTitle, setEditBody]);

  const handleEdit = async (id) => {
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const updatedPost = { id, title: editTitle, datetime, body: editBody };
    try {
      const response = await api.put(`/posts/${id}`, updatedPost);
      setPosts(posts.map( post => post.id === id ? { ...response.data } : post));
      setEditTitle('');
      setEditBody('');
      history.push('/');
    } catch(err) {
      console.log(`Error: ${err.message}`);
    }
}

  return (
    <main className='NewPost'>
        {editTitle &&
          <>
            <h2>Edit Post</h2>
            <form className='newPostForm' onSubmit={(e) => e.preventDefault()}>
              <label htmlFor='postTitle'>Title:</label>
              <input
                id="postTitle"
                type='text'
                required
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <label htmlFor='postBody'>Post:</label>
              <textarea
                id="postbody"
                required
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
              />
              <button type='submit' onClick={() => handleEdit(post.id)}>Submit</button>
            </form>
          </>
        }
        {!editTitle &&
          <>
            <h2>Post Not Found</h2>
            <p>Well, That's disappointing.</p>
            <p>
              <Link to="/">Visit Our HomePage</Link>
            </p>
          </> 
        }
    </main>
  )
}

export default EditPost