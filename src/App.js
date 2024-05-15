import Header from './Header';
import Nav from './Nav';
import Footer from './Footer';
import Home from './Home';
import NewPost from './NewPost';
import PostPage from './PostPage';
import EditPost from './EditPost';
import About from './About';
import Missing from './Missing';
import { Route, Switch } from 'react-router-dom';
import { DataProvider } from './context/DataContext';

function App() {

  return (
    <div className="App">
      <Header title="React JS Blog" />
      <DataProvider>
        <Nav />
        <Switch>
          {/* if we don't use exact for '/', all the other routes is similar with home endpoint and react dosen't route to other page
              note: when your route is share between different endpoint, you need to use `exact` keyword */}
          <Route exact path="/" component={Home} />
          <Route exact path="/post" component={NewPost} />
          <Route path="/edit/:id" component={EditPost} />
          <Route path="/post/:id" component={PostPage} />
          <Route path="/about" component={About} />
          <Route path="*" component={Missing} />
        </Switch>
      </DataProvider>
      <Footer />
    </div>
  );
}

export default App;
