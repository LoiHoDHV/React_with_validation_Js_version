import InputForm from "./components/input_form/InputForm";
import "./assets/bootstrap/css/bootstrap.min.css";
import "./App.css";
import { useState } from "react";

function App() {
    // ở đây khi mà listToDo chứa dữ liệu sẽ có dạng
    /* [{'inputItem': 'du lieu 1'},
        {'inputItem': 'du lieu 2'},
        ......
    ]
        */
    let [listToDo, setListToDo] = useState([]);


    // function này dùng để render ra các to do => tìm hiểu thêm về js
    let renderListItem = () => {
        return listToDo.map((item) => {
            return (
                <>
                    <li>{item.inputItem}</li>
                </>
            );
        });
    };

    let updateListToDoByAddingOne = (todoItem) => {
        let newListToDo = [...listToDo];
        newListToDo.push(todoItem);
        setListToDo(newListToDo);
    };

    let renderApp = () => {
        return (
            <div className="App my-5">
                <div className="container">
                    <div className="row">
                        <div className="col-6 offset-3 d-flex justify-content-center border border-dark">
                            <div className="row text-center">
                                <h3 className="border-0 font-weight-bold">
                                    Browser
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* BEGIN: HEADER INPUT */}
                    <div className="row ">
                        <div className="col-6 offset-3 d-flex justify-content-center border">
                            <div className="row text-center">
                                <h4 className=" col-12 border-0 font-weight-bold">
                                    To-do List
                                </h4>
                                <p className="col-12">
                                    Enter text into the input field to add items
                                    to your list
                                </p>
                                <p className="col-12">
                                    Click the "X" to remove the item from your
                                    list.
                                </p>
                                <p className="col-12">
                                    Click the item to mark it as complete
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* END: HEADER INPUT */}

                    {/* BEGIN: INPUT FIELD */}
                    {/* <InputForm handleInput={handleInput}></InputForm> */}
                    <div className="row">
                        <div className="col-6 offset-3 d-flex justify-content-center mt-5">
                            <InputForm
                                updateListToDoByAddingOne={
                                    updateListToDoByAddingOne
                                }
                            ></InputForm>
                        </div>
                    </div>
                    {/* END : INPUT FIELD */}

                   {/* BEGIN: LIST TO DO */}
                    <div className="row">
                        <div className="col-6 offset-3 d-flex justify-content-center mt-5">
                            {listToDo.length === 0 ? (
                                "List To Do Hiện nay đang rỗng"
                            ) : (
                                <ul className="list-group col-12">
                                    {renderListItem()}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* END : LIST TO DO */}
                </div>
            </div>
        );
    };

    return <> {renderApp()} </>;
}

export default App;
