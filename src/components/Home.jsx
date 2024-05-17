
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import "./Home.css"

function Home() {

    const [fetchImages, setFetchImages] = useState()
    const [buttonActive, setButtonActive] = useState(false)
    const [imageFile, setImageFile] = useState(null);
    const[ imageCount,setImageCount] = useState(10)
    const[searchInput,setSearchInput] = useState(null)
    const[activatedButton,setActivatedButton] = useState("Latest")
    const[userInput,setUserInput] = useState({
        tag:"",
        isFavorite:false,
    })


    const {tag,isFavorite} = userInput;

      // For fetching Images
    const fetchImagesFromAPI = async (count) => {
        if(count == undefined){
            count = 10
        }
        let data = await fetch(`http://localhost:4000/api/latestImages?count=${count}`, {
            method: "GET",
        })
            .then((response) => {
                return response.json();
            })
            .catch((err) => console.log(err));

        if (data.success == true) {
            setFetchImages(data.message)
            console.log(data.message)
        }
    }

// fetching favorite images
    const fetchingFevAPI = async(count)=>{
        if(count == undefined){
            count = 10
        }
        let favoriteImages = await fetch(`http://localhost:4000/api/favorites?count=${count}`, {
            method: "GET",
        })
            .then((response) => {
                return response.json();
            })
            .catch((err) => console.log(err));
        
        if(favoriteImages.success == true){
          return  setFetchImages(favoriteImages.message)
        }
    }
    useEffect(() => {
      

    
        activatedButton == "Latest"  &&  fetchImagesFromAPI(imageCount)
        activatedButton == "Favorites" && fetchingFevAPI(imageCount)

      
    }, [imageCount])

   

    const userSelected = async(value) =>{
        if(buttonActive){
        setButtonActive(false)
        }
        if(value == "Favorites"){
            setActivatedButton("Favorites")
            fetchingFevAPI()
    }

    if(value == "Latest"){
        setActivatedButton("Latest")
      return  fetchImagesFromAPI()
    }

  
}


const handleImageChange = (el) =>{
    const file = el.target.files[0];
    setImageFile(file);

}
const handleTagChange = (event) => {
    setUserInput({...userInput,tag:event.target.value});
  };



const handleFavoriteChange = (event) => {
    setUserInput({...userInput,isFavorite:event.target.value});
  };

  const handleSubmit = async(el) =>{
    let waiting =  toast.loading('Waiting...',{
    
        style: {
          borderRadius: '10px',
         
        },
      })
    el.preventDefault();
    const formData = new FormData();
    formData.append('gallery', imageFile);
    formData.append('tag',tag);
    formData.append('isFavorite', isFavorite);

    let uploadingImages = await fetch(`http://localhost:4000/api/upload`, {
            method: "POST",
            body: formData,
        })
            .then((response) => {
                return response.json();
            })
            .catch((err) => console.log(err));
            if(uploadingImages.success){
                toast.dismiss(waiting);
                toast.success("SuccessFull Uploaded");
                console.log("uploadined done")
                setUserInput({tag:"",})

            }
            toast.dismiss(waiting);
            if(!uploadingImages.success){
            toast.error(uploadingImages.message);
            }

  }
  const imageCountFun = (el) =>{
setImageCount(el.target.value)

  }

  const searchSubmitHandle = async(el)=>{
el.preventDefault();
let imageSearchResult = await fetch(`http://localhost:4000/api/search/${searchInput}`, {
    method: "GET",
})
    .then((response) => {
        return response.json();
    })
    .catch((err) => console.log(err));
if(imageSearchResult.success == true){

    setFetchImages(imageSearchResult.message)
}
if(!imageSearchResult.success){
    toast.error(imageSearchResult.message);
}
  }

  const searchHandle = (el)=>{
    setSearchInput(el.target.value)
  }

return (
    <>
        <div className='Header-container'>
        <Toaster position="top-center" />
            <div class="search-section">
                <div class="search-content ">
                    <h1 className='heading'> Gallery</h1>
                    <p className="sub-heading">Find Your Past here...</p>
                </div>
                <div class="search-tag">
                    <form onSubmit={searchSubmitHandle}>
                        <input placeholder="Enter The Tag To search" value={searchInput} onChange={searchHandle} />
                        <button  type="submit">Search</button>
                    </form>
                </div>
            </div>
        </div>
        <div className='main-container'>
<div className="container-sub-menu">
            <div className="sub-menu">
                <button onClick={()=>{userSelected("Latest")}} >Latest</button>
                <button onClick={()=>setButtonActive(!buttonActive)}>+ New </button>
                <button onClick={()=>{userSelected("Favorites")}}>Favorites</button>
            
            </div>

            <input type="number"  className="images-count" value={imageCount} onChange={imageCountFun} />
            </div>

            <div className="gallery-images">
                {  fetchImages  && !buttonActive && fetchImages.map((el) => (
                    <img src={el.image} height={200} ></img>
                ))

                }

                { buttonActive  &&
                    (
                        <form className="userinput" onSubmit={handleSubmit}>
                            <input type="file"   onChange={handleImageChange}/>
                            <input type="text" placeholder="Enter the tag Name" value={tag} onChange={handleTagChange} />
                            <select value ={isFavorite} onChange={handleFavoriteChange}>
    <option value={true}>Yes</option>
    <option value={false} >No</option>
  </select>
  <button type="submit" className="submit-button">Submit</button>
                        </form>
                    )
                }


                


            </div>
        </div>


    </>
);
}

export default Home;
