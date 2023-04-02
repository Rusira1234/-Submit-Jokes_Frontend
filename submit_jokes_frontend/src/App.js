import logo from './logo.svg';
import './App.css';
import {useState, useEffect, useRef} from 'react';
import Swal from 'sweetalert2'

function App() {
  // to retriew types from the database
  const [types, settypes] = useState([])
  // to grab the chosen type option
  const [the_type, setoptions] = useState()
  // to take the description
  const [description, setdescription] = useState()
  //to facilitate useEffect circumstance
  const effectRun = useRef(false);
  // -----------------------------------
  useEffect(() => {
    // handling useEffect accordingly to avoid calling it twise (React update after version 18)
    if(effectRun.current == false){
      const fetch_types = async () => {
        fetch("http://localhost:8070/joke-types")
        .then((data) => data.json())
        .then((val) => settypes(val.data))
      }
      fetch_types();
      return () => {
        effectRun.current = true;
      }
    }
    // -------------------------------------------------------------------------------------
  }, []);

  const onSubmitHandler = async (event) => {
    event.preventDefault(); // to avoid loading the page upon form submission
    console.log(description);
    console.log(the_type);
    try {
      const item_description = description;
      const item_type = the_type;
      const response = await fetch("http://localhost:8070/submit-joke", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: item_description,
          type: item_type,
        }),
      });
      const the_response = await response.json();
      console.log(the_response);
      if (the_response.acknowledged) {
        Swal.fire("Joke was successfully saved");
        //alert("Joke was successfully saved");
      }
      setdescription('');
      setoptions('');
    } catch (err) {
      console.log(err);
      Swal.fire("Something wrong happend");
      //alert("Something wrong happend");
    }
  }
  return (
    <div className="App">
      <h1>New Joke</h1>
      <form onSubmit={onSubmitHandler}>
        <div className='form-group'>
          <label htmlFor='Description' className='form-label'>Description</label>
          <input className = "form-control" name= "description" onChange={(e) => setdescription(e.target.value)} value={description}/>
        </div>
        <div className='form-group'>
          <label htmlFor='Type' className='form-label'>Type</label>
          <select className = "form-select" name= "type" onChange={(e) => setoptions(e.target.value)} value={the_type} >
              {
                types.map((opts,i) => <option key= {i}>{opts}</option>)
              }
          </select>
        </div>
        <div className='form-group'>
          <button style = {{width: "100px", height: "35px"}} className='btn' type="submit" >Submit</button>
        </div>
      </form>
    </div>
  );
}

export default App;
