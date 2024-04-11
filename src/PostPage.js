import React from 'react'
import { useParams, Link } from 'react-router-dom';

/*
  useParams initiate to param that calls id, the reason is we define "id" for routing in app.js => (/posts/:id)
*/

const PostPage = ( {posts, handleDelete} ) => {

  const {id} = useParams();
  const post = posts.find(post => (post.id).toString() === id);

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
              <button className="deleteButton" k={ () => handleDelete(post.id)}>
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