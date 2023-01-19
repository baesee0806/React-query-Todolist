// src/App.jsx

import axios from "axios";
import React, { useEffect, useState } from "react";
import { QueryClient, useMutation, useQuery, useQueryClient } from "react-query";
import styled from "styled-components";


const App = () => {

  const queryClient = useQueryClient()

  // 리스트 axios get
  // const [lists,SetLists] = useState([]);

  const fetchLists = async() => {
    const {data} = await axios.get("http://localhost:3001/lists")
    // SetLists(data);
    return data
  }

  useEffect(() => {
    fetchLists();
  }, []);
  
  
  
  
  // 리스트 axios post
  
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  
  
  const lists = {
    title,
    content,
  }
  
  
  const postList = async(lists) => {
    
    // el.preventDefault()
    
    
    await axios.post("http://localhost:3001/lists", lists); 
		
		// fetchLists();
  };
  
  
  // 리스트 axios delete
  
  const deletList = (listId) => {
    axios.delete(`http://localhost:3001/lists/${listId}`);
    // fetchLists();
  };

  //delete mutation
  const deleteMutation = useMutation(deletList,{
    onSuccess:()=>{
      queryClient.invalidateQueries("lists")
    }
  })

  const ondeletehandler = (listId)=>{
    deleteMutation.mutate(listId)
  }
  //post Mutation
  const postmutation = useMutation(postList,{
    onSuccess:()=>{
      queryClient.invalidateQueries('lists')
    }
  })

  const onsubmithandler = ()=>{
    postmutation.mutate(lists)
  }
    // 수정
    // const [editComment, setEditComment] = useState();

    // const commentMutation = useMutation(changeDetail, {
    //   onSuccess: () => {
    //     queryClient.invalidateQueries([category, listId]);
    //   },
    // });
  
    // const editHandler = (id, value) => {
    //   setEditComment(value);
    //   dispatch(onEdit(id));
    // };
  
    // const submitHandler = () => {
    //   const newComments = comments.map((x) => {
    //     if (x.id === comment.id) {
    //       return { ...x, comment: editComment };
    //     } else {
    //       return { ...x };
    //     }
    //   });
    //   commentMutation.mutate([category, listId, { comments: newComments }]);
    //   dispatch(offEdit());
    // };
  // query get
  const { isLoading, isError, data } = useQuery("lists", fetchLists);
  
  if(isLoading){
    return alert("로딩중")
  }
  
  if(isError){
    return alert("에러")
  }
  return (
    <>
    <HeaderDiv>
      <h2>Header</h2>
    </HeaderDiv>
     
    <AddListDiv>
      <div>
        <label>제목</label>
        <input 
        value={title}
        onChange ={(e)=>{
          setTitle(e.target.value)
        }}
        />
        <label>내용</label>
        <input
        value={content}
        onChange ={(e)=>{
          setContent(e.target.value)
        }}
        />
      </div>

      <button onClick={onsubmithandler}>추가</button>
      
    </AddListDiv>

    {data.map(list=> {
      return(
        <ListDiv>
          <ListTitleContentDiv>
             <h2>{list?.title}</h2>
             <p>{list?.content}</p>
          </ListTitleContentDiv>
          <div>
             <button>수정</button>
             <button onClick={()=>{ondeletehandler(list.id)}}>삭제</button>
          </div>
        </ListDiv>
      )
      })}
    {/* <ListDiv>
      <ListTitleContentDiv>
        <h2>제목</h2>
        <p>내용</p>
      </ListTitleContentDiv>
      <div>
      <button>수정</button>
      <button>삭제</button>
      </div>
    </ListDiv> */}
    

    </>
  );
};

export default App;

const HeaderDiv = styled.div`
  display: flex;
  justify-content: center;
  border-bottom: 1px solid black;

`;

const AddListDiv = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-bottom: 1px solid black;
  height: 50px;
`;

const ListDiv = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-bottom: 1px solid black;
`;

const ListTitleContentDiv = styled.div`
  display: flex;
  align-items: center;
`;