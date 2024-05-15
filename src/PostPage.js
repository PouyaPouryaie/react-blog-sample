import React from 'react'
import { useParams, Link, useHistory } from 'react-router-dom';
import { useContext } from 'react';
import api from './api/posts';
import DataContext from './context/DataContext';

/*
  useParams initiate to param that calls id, the reason is we define "id" for routing in app.js => (/posts/:id)
*/

const PostPage = () => {

  const {  posts, setPosts } = useContext(DataContext);
  const {id} = useParams();
  const post = posts.find(post => (post.id).toString() === id);

  /*
    to serve component instead of requesting anyting from server,
    we are serving the component that is routed to home directory by using browser history
    the reason, we use to '/posts' as endpoint is we create json-server and the name of the object is defined posts 
  */
  const history = useHistory();

  const handleDelete = async(id) => {
    try {
      await api.delete(`/posts/${id}`);
      const postsList = posts.filter(post => post.id !== id);
      setPosts(postsList);
      history.push('/');
    }catch (err) {
      console.log(`Error: ${err.message}`);
    }

}

  return (
    <main className='PostPage'>
        <article className='post'>
          {/* "post &&" means if post exist then render next part */}
           {post && 
            <>
              <h2>{post.title}</h2>
              <p className='postDate'>{post.datetime}</p>
              <p className='postBody'>{post.body}</p>
              <Link to={`/edit/${post.id}`}><button className='editButton'>Edit Post</button></Link>
              <button className="deleteButton" onClick={ () => handleDelete(post.id)}>
                Delete Post
              </button>
            </>
           }
           {!post &&
            <>
              <h2>Post Not Found</h2>
              <p>Well, That's disappointing.</p>
              <p>
                <Link to="/">Visit Our HomePage</Link>
              </p>
            </> 
           }
        </article>
    </main>
  )
}

export default PostPage