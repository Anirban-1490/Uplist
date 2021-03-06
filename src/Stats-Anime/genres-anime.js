import React from "react";
import "./genreAnime-style.css";
import { useQuery,useQueryClient } from "react-query";
import axios from "axios";
import {Mulimgslider} from "./mul_img_slider";
import react from "react";
import {Spinner} from "./loading-spinner"

export const Genres = ()=>
{
    const delay = (ms = 3000) => new Promise(r => setTimeout(r, ms));
    const [genre_id,setID] = react.useState(4);
    
   
    const options = [{genre_id:1,name:"Action"},
                    {genre_id:2,name:"Adventure"},
                    {genre_id:4,name:"Comedy"},
                    {genre_id:7,name:"Mystery"},
                    {genre_id:8,name:"Drama"},
                    {genre_id:10,name:"Fantasy"},
                    {genre_id:15,name:"Kids"},
                    {genre_id:22,name:"Romance"},
                    {genre_id:24,name:"Sci Fi"}
                ];


    const getResult = async (genre_id) => {
        await delay()
        return axios.get(`https://api.jikan.moe/v3/genre/anime/${genre_id}/1`).then(res => res.data.anime.slice(0, 16));
    }


    const { data,isLoading} = useQuery(["genre",genre_id], () => getResult(genre_id),
    {
        refetchIntervalInBackground:false,
        staleTime:0,
        cacheTime:0,
        onSettled: async(data,err)=>{
            if(err) return console.log(err);
            //* delay to show a loading animation
            await delay()
            return data;
        }
        
    });
  
    
  
    return <>
        <div className="genre-first">
            <h2>DISCOVER 
                <span>More Anime</span> 
                
            </h2>
            <div className="item">
               {
                    (isLoading) ?  <Spinner/>:
                    <Mulimgslider items={data} switch_details="/anime" />
               } 
               
            </div>
        </div>

        <div className="wrapper-type">
            <h4>Choose your type</h4>
            <Dropdown options = {options} setID = {setID}  placeholder = "Comedy" stats_anime ={null} />

        </div>
    </>
}

//* drop down options------

export const Dropdown = (prop)=>
{
    const {options , setID ,placeholder,stats_anime} = prop;
    const optionref = react.useRef();

    const client = useQueryClient();
    
   
    const dropDownToggle = ()=>
    {
        optionref.current.classList.toggle("active");
        document.querySelector(".wrapper-input").classList.toggle("active")
    }

    //* when moving to diff page(from anime list -> char list) this will clear out the set key value for sorting the lists
    const clrDrop = react.useCallback(() => {
        if (stats_anime) {
            setID("");
            document.querySelector(".genre-display").value = null;
        }
    }, [stats_anime])

    react.useEffect(() => {
        clrDrop()

    }, [clrDrop]);


    const optionClickHandler =async (_name,genre_id,name)=>{
        //* if _name is valid meaning if this is a userlist page
        if(_name) setID(_name);
        else{
            //* refetch the query on diffrent genre id
            await client.refetchQueries(["genre", genre_id])
            setID(genre_id);
        }
       
        document.querySelector(".genre-display").value = name;
        optionref.current.classList.toggle("active");
        document.querySelector(".wrapper-input").classList.toggle("active")
    }

   return <div className="wrapper-input">
                <ion-icon name="chevron-down-outline"></ion-icon>
                <input className="genre-display" placeholder={placeholder} type="text" name="" readOnly onClick={dropDownToggle}/>
                <div className="option" ref={optionref}>
                    {
                        options.map(option => {
                            const {genre_id,name,_name} = option;
                            return (genre_id) ? <div
                                onClick={
                                    optionClickHandler.bind(this,_name,genre_id,name)
                                } key={genre_id}>
                                <h4>{name}</h4>
                            </div> : ""
                        })
                    }

                </div>
            </div>
}