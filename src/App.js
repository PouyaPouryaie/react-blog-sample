import Header from './Header';
import Nav from './Nav';
import Footer from './Footer';
import Home from './Home';
import NewPost from './NewPost';
import PostPage from './PostPage';
import EditPost from './EditPost';
import About from './About';
import Missing from './Missing';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useState, useEffect} from 'react';
import { format } from 'date-fns';
import api from './api/posts'
import useWindowSize from './hooks/useWindowSize';
import useAxiosFetch from './hooks/useAxiosFetch';

function App() {
  const [posts, setPosts] = useState ([])
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');

  /*
    to serve component instead of requesting anyting from server,
    we are serving the component that is routed to home directory by using browser history
    the reason, we use to '/posts' as endpoint is we create json-server and the name of the object is defined posts 
  */
  const history = useHistory();

  const { width } = useWindowSize();
  const { data, fetchError, isLoading } = useAxiosFetch('http://localhost:3500/posts');

  useEffect( () => {
    setPosts(data);
  }, [data])

  /* comment because of useAxiosFetch
  useEffect( () => {
    const fectPosts = async () => {
      try {
        const response = await api.get('/posts');
        if(response && response.data) {
          setPosts(response.data);
        }
      } catch (err) {
        if(err.response) {
          // Not in the 200 response range use these logs based on Axios Doc
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
        } else {
          console.log(`Error: ${err.message}`);
        }
      }
    }

    fectPosts();
  }, [])

  */

  useEffect( () => {
    const filteredResults = posts.filter(post => (
        (post.body).toLowerCase()).includes(search.toLowerCase())
        ||
        ((post.title).toLowerCase()).includes(search.toLowerCase())
      );

      setSearchResult(filteredResults.reverse());
  }, [posts, search]);


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
    <div className="App">
      <Header title="React JS Blog" width={width} />
      <Nav search={search} setSearch={setSearch}/>
      <Switch>
        {/* if we don't use exact for '/', all the other routes is similar with home endpoint and react dosen't route to other page
            note: when your route is share between different endpoint, you need to use `exact` keyword */}
        <Route exact path="/">
          <Home
            posts={searchResult}
            fetchError={fetchError}
            isLoading={isLoading}
            />
        </Route>
        <Route exact path="/post">
          <NewPost
            handleSubmit={handleSubmit}
            postTitle={postTitle} 
            setPostTitle={setPostTitle}
            postBody={postBody}
            setPostBody={setPostBody} 
          />
        </Route>
        <Route path="/edit/:id">
          <EditPost
            posts={posts}
            handleEdit={handleEdit}
            editBody={editBody}
            setEditBody={setEditBody} 
            editTitle={editTitle} 
            setEditTitle={setEditTitle}
          />
        </Route>
        <Route path="/post/:id">
          <PostPage posts={posts} handleDelete={handleDelete} />
        </Route>
        <Route path="/about" component={About} />
        <Route path="*" component={Missing} />
      </Switch>
      <Footer />
    </div>
  );
}

export default App;
