import Task from "../Task";
import React, {useState} from "react";
import PopupModal from "../Modal/PopupModal";
import FormInput from "../FormInput/FormInput";
// import Button from "../Button/Button";
import * as dayjs from 'dayjs';

const TaskTable = ({tasks, client}) => {
  const [loading] = useState(false);
  const [error] = useState({ label: "", url: "", source: "" });

  const [taskInfoModal, setTaskInfoModal] = useState(false)
    const getTime = (start_time, finish_time, task_finished) => {
        var start_date = dayjs(start_time)
        var finish_date;
        if (task_finished === 1) {
            finish_date = dayjs(finish_time);
        }

        if (task_finished === 0) {
            finish_date = dayjs();
        }

        var y = start_date.get('year');
        var mo = start_date.get('month');
        var d = start_date.get('date');
        var h = start_date.get('hour');
        var mi = start_date.get('minute');
        var s = start_date.get('second');
        finish_date = finish_date.subtract(y, 'year');
        finish_date = finish_date.subtract(mo, 'month');
        finish_date = finish_date.subtract(d, 'date');
        finish_date = finish_date.subtract(h, 'hour');
        finish_date = finish_date.subtract(mi, 'minute');
        finish_date = finish_date.subtract(s, 'second');
        return finish_date.format('HH:mm:ss')
    };


    const handleClickStart = () => {
        console.log(taskInfoModal.id);
        console.log("task start");
        client.fetchUser().then((user) => {
            client
                .updateTime(
                    taskInfoModal.id,
                    0,
                    user?.id
                ).then((data) => {  // eslint:ignore
                console.log(data.data);
                setTaskInfoModal(data.data);
            });
        });
    };

    const handleClickFinish = () => {
        console.log(taskInfoModal.id);
        console.log("task finish");
        client.fetchUser().then((user) => {
            client
                .updateTime(
                    taskInfoModal.id,
                    1,
                    user?.id
                ).then((data) => {  // eslint:ignore
                console.log(data.data);
                setTaskInfoModal(data.data);
            });
        });
    };

    return (
      <>
        <div className="sections-list">
          {tasks.length && (
              tasks.map((task) => (
                <Task showTaskInfoModal={() => {
                    client.getTask(task.id).then((data) => {  // eslint:ignore
                        setTaskInfoModal(data.data);
                    })


                }} key={task.id} task={task}  />
              ))
          )}
          {!tasks.length && (
              <p>No tasks found!</p>
          )}
        </div>
        {taskInfoModal && <PopupModal
						modalTitle={"Task Info"}
						onCloseBtnPress={() => {
                            console.log("closed info modal");
							setTaskInfoModal(false);
						}}
					>
						<div className="mt-4 text-left">
							<form className="mt-5">
								<FormInput
									disabled
									type={"text"}
									name={"label"}
									label={"Label"}
									value={taskInfoModal?.label}
								/>
								<FormInput
									disabled
									type={"text"}
									name={"url"}
									label={"Url"}
									value={taskInfoModal?.url}
								/>
								<FormInput
									disabled
									type={"text"}
									name={"source"}
									label={"Description"}
									value={taskInfoModal?.source}
								/>
                                <FormInput
                                    disabled
                                    type={"text"}
                                    name={"time"}
                                    label={"Time"}
                                    value={getTime(taskInfoModal?.start_time, taskInfoModal?.finish_time, taskInfoModal?.task_finished)}
                                />
							</form>

                            <button
                                className={`flex flex-row justify-center items-center w-full bg-teal-600 ${error ? "mt-6" : "" } cursor-pointer hover:bg-teal-700 text-white font-bold py-2 px-4 mb-6 rounded `}
                                type="submit"
                                onClick={handleClickStart}
                            >
                                {
                                    loading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                    </svg>
                                }
                                {"Start task"}
                            </button>

                            <button
                                className={`flex flex-row justify-center items-center w-full bg-teal-600 ${error ? "mt-6" : "" } cursor-pointer hover:bg-teal-700 text-white font-bold py-2 px-4 mb-6 rounded `}
                                type="submit"
                                onClick={handleClickFinish}
                            >
                                {
                                    loading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                    </svg>
                                }
                                {"end task"}
                            </button>
						</div>
					</PopupModal>}
      </>
    )
}

export default TaskTable;