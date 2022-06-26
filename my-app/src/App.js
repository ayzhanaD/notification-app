import './App.css';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
    addNoti, 
    deleteNoti, 
    updateContent, 
    updateTitle  
} from './features/Notifications.js';

import io from 'socket.io-client';

const socket = io.connect('http://localhost:3001');


const App = () => {
    const dispatch = useDispatch();
    const notiList = useSelector((state) => state.notifications.value);

    const [title, setTitle] = useState("title"); 
    const [content, setContent] = useState("some text"); 
    const [newContent, setNewContent] = useState(""); 
    const [newTitle, setNewTitle] = useState("");
    const [type, setType] = useState("SUCCESS");
    const [notiReceived, setNotiReceived] = useState('');

    useEffect(() => {
        socket.on("receive_notification", (data) => {
            setNotiReceived(data.notification);
        });
    }, [socket]);

   return(

    <div className="app">


        {/* received notification */}

        <div className='received-noti'>
            <h1>Received Notification: </h1>
            <div className="noti" id="noti">
                <p>{notiReceived}</p>
            </div>
        </div>


        {/* add notification */}

        <div className="add-noti">
            <h1>Add New Notification: </h1>
            <select name="types" onChange={(event) => {setType(event.target.value)}}>
                <option value="SUCCESS">SUCCESS</option>
                <option value="WARNING">WARNING</option>
                <option value="FAIL">FAIL</option>
            </select>
            <input 
            type="text" 
            placeholder="title.." 
            onChange={
                (event) => {setTitle(event.target.value)}
            }/>
            <input 
            type="text" 
            placeholder="content.."
            onChange={
                (event) => {setContent(event.target.value)}
            }/>
            <button onClick={() => {
                dispatch(addNoti({
                    id: notiList[notiList.length - 1].id + 1,
                    type,
                    title, 
                    content
                    }))
                }}
            >Add Notification</button>
        </div>


        {/* created notifications list */}

        <h1>Notifications: </h1>
        <div className="display-noti">
            {notiList.map((noti) => {
                const sendNotification = () => {
                    socket.emit('send_notification', {notification: `${noti.title}: ${noti.content} ${noti.type}`});
                };

                return (
                    <div className='created-noti'>
                        <h2>{noti.type}</h2>
                        <h3 className='text'>{noti.title}</h3>
                        <p className='text'>{noti.content}</p>
                        <div className='inputs'>
                            <input 
                                type="text" 
                                placeholder="new title.."
                                onChange={(event) => {setNewTitle(event.target.value)}}/>
                            <input 
                                type="text" 
                                placeholder="new content.."
                                onChange={(event) => {setNewContent(event.target.value)}}/>
                        </div>
                        <div className='btns'>
                            <button
                                onClick={() => {dispatch(updateTitle({id: noti.id, title: newTitle}))}}
                            >Update title</button>
                            <button
                                onClick={() => {dispatch(updateContent({id: noti.id, content: newContent}))}}
                            >Update content</button>
                            <button 
                                onClick={() => {dispatch(deleteNoti({id: noti.id}))}}
                            >Delete notification</button>
                            <button onClick={sendNotification}>Send notification</button>
                        </div>
                    </div>)
                })
            }
        </div>
    </div>
    )
}

export default App;