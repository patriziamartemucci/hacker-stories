import * as React from 'react';

const List = ({list,onRemoveItem})=>(
    <ul>
      {list.map((item)=>(
        <Item 
        key={item.objectID}
        item={item}
        onRemoveItem={onRemoveItem}
        />
      )
      )
      }
    </ul>
  );


const Item = ({item,onRemoveItem})=>(

      <li>
        <span>
          <a href={item.url}>{item.title}</a>
        </span>
        <span>{item.author}</span>
        <span>{item.num_comments}</span>
        <span>{item.points}</span>
        <span>
          <button type="button" onClick={()=>{
                //fai qualcosa
                //console.log("Ciao");
                onRemoveItem(item);
                }
          }>
            Dismiss
          </button>
        </span>
      </li>
);


const InputWithLabel = ({id,label,value,type='text',onInputChange,isFocused,children}) => {
  const inputRef = React.useRef();
  React.useEffect(()=>{
    if (isFocused && inputRef.current){
      inputRef.current.focus();
    }
  },[isFocused]);

  return(
    <>
        <label htmlFor={id}>{children} </label>
        &nbsp;
        <input ref={inputRef} id={id} type={type} value={value} autoFocus={isFocused} onChange={onInputChange}/>  
    </> 
  );
};

const useStorageState = (key,initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );



  React.useEffect(() => {
  localStorage.setItem(key,value);
  },[value,key]);
  return [value,setValue];
};

const App = () => {

  const initialStories =[{
    title:'React',
    url:'https://reactjs.org',
    author:'Jordan Walke',
    num_comments:3,
    points:4,
    objectID:0
  },
  {
    title:'Redux',
    url:'https://reducs.js.org',
    author:'Dan Abramov, Andrew Clark',
    num_comments:2,
    points:5,
    objectID:1
  }
  ];
  

  const [searchTerm, setSearchTerm]=useStorageState(
    'search','React'
  );

  const [stories,setStories] = React.useState([]);
  
  React.useEffect(()=>{
    getAsyncStories().then(result => {
        setStories(result.data.stories);
      });
  },[]);

  const getAsyncStories = () =>
    new Promise((resolve)=>
      setTimeout(
        ()=>resolve({data:{stories:initialStories}}),2000
      )
    );
  
  const handleRemoveStory = (item) =>{
    const newStory=stories.filter(
      (story)=>item.objectID !== story.objectID
      );
    setStories(newStory);
  };

  
  

  const handleSearch=(event)=>{
    setSearchTerm(event.target.value);
    console.log(event.target.value);
    localStorage.setItem('search',event.target.value);
  };

  const searchedStories = stories.filter((story) => 
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  
  return(
  <div>
    <h1>My Hacker Stories</h1>

    <InputWithLabel
    id="search"
    value={searchTerm}
    isFocused={true}
    onInputChange={handleSearch}
    >
      <strong>Search:</strong>
    </InputWithLabel>
    <hr />

    <List list={searchedStories} onRemoveItem={handleRemoveStory} />
  </div>
  );
};


export default App;
