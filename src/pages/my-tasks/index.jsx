import React, { useEffect, useState } from "react";
import FastAPIClient from "../../client";
import config from "../../config";
import DashboardHeader from "../../components/DashboardHeader";
// import Footer from "../../components/Footer";
import jwtDecode from "jwt-decode";
import * as moment from "moment";
import TaskTable from "../../components/TaskTable";
import FormInput from "../../components/FormInput/FormInput";
import Button from "../../components/Button/Button";
import { NotLoggedIn } from "./NotLoggedIn";
import Loader from "../../components/Loader";
import PopupModal from "../../components/Modal/PopupModal";

const client = new FastAPIClient(config);

const ProfileView = ({ tasks, client, fetchUserTasks}) => {
	return (
		<>
			<TaskTable
				tasks={tasks}
				client={client}
				fetchUserTasks={fetchUserTasks}
				showUpdate={true}
			/>
			
		</>
	);
};

const TaskDashboard = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [error, setError] = useState({ label: "", url: "", source: "" });
	const [taskForm, setTaskForm] = useState({
		label: "",
		url: "https://",
		source: "",
	});

	const [showForm, setShowForm] = useState(false);
	const [tasks, setTasks] = useState([]);

	const [loading, setLoading] = useState(false);
	const [refreshing, setRefreshing] = useState(true);

	useEffect(() => {
		fetchUserTasks();
	}, []);

	const fetchUserTasks = () => {
		client.getUserTasks().then((data) => {
			setRefreshing(false);
			setTasks(data?.results);
		});
	};

   const urlPatternValidation = URL => {
        const regex = new RegExp('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?');
          return regex.test(URL);
        };

	const onCreateTask = (e) => {
		console.log("CREATING RECIPE");
		e.preventDefault();
		setLoading(true);
		setError(false);

		if (taskForm.label.length <= 0) {
			setLoading(false);
			return setError({ label: "Please Enter Task Label" });
		}
		if (taskForm.url.length <= 0) {
			setLoading(false);
			return setError({ url: "Please Enter Task Url" });
		}
		if (!urlPatternValidation(taskForm.url)) {
			setLoading(false);
			return setError({ url: "Please Enter Valid URL" });
		}
		if (taskForm.source.length <= 0) {
			setLoading(false);
			return setError({ source: "Please Enter Task Description" });
		}


		client.fetchUser().then((user) => {
			client
				.createTask(
					taskForm.label,
					taskForm.url,
					taskForm.source,
					user?.id
				)
				// eslint-disable-next-line no-unused-vars
				.then((data) => {  // eslint:ignore
					fetchUserTasks();
					setLoading(false);
					setShowForm(false);
				});
		});
	};

	useEffect(() => {
		const tokenString = localStorage.getItem("token");
		if (tokenString) {
			const token = JSON.parse(tokenString);
			const decodedAccessToken = jwtDecode(token.access_token);
			if (moment.unix(decodedAccessToken.exp).toDate() > new Date()) {
				setIsLoggedIn(true);
			}
		}
	}, []);

	if (refreshing) return !isLoggedIn ? <NotLoggedIn /> : <Loader />;

	return (
		<>
			<section
				className="flex flex-col bg-black text-center"
				style={{ minHeight: "100vh" }}
			>
				<DashboardHeader />
				<div className="container px-5 pt-6 text-center mx-auto lg:px-20">
					<h1 className="mb-12 text-3xl font-medium text-white">
						Tasks
					</h1>

					<button
						className="my-5 text-white bg-teal-500 p-3 rounded"
						onClick={() => {
							setShowForm(!showForm);
						}}
					>
						Create Task
					</button>

					<p className="text-base leading-relaxed text-white">Latest tasks</p>
					<div className="mainViewport text-white">
						{tasks.length && (
							<ProfileView
								tasks={tasks}
								client={client}
								fetchUserTasks={fetchUserTasks}
							/>
						)}
					</div>
				</div>

			</section>
			{showForm && (
				<PopupModal
					modalTitle={"Create Task"}
					onCloseBtnPress={() => {
						setShowForm(false);
						setError({ fullName: "", email: "", password: "" });
					}}
				>
					<div className="mt-4 text-left">
						<form className="mt-5" onSubmit={(e) => onCreateTask(e)}>
							<FormInput
								type={"text"}
								name={"label"}
								label={"Label"}
								error={error.label}
								value={taskForm.label}
								onChange={(e) =>
									setTaskForm({source: taskForm.source, url: taskForm.url, label: e.target.value})
								}
							/>
							<FormInput
								type={"text"}
								name={"url"}
								label={"Url"}
								error={error.url}
								value={taskForm.url}
								onChange={(e) =>
									setTaskForm({source: taskForm.source, url: e.target.value, label: taskForm.label})
								}
							/>
							<FormInput
								type={"text"}
								name={"source"}
								label={"Description"}
								error={error.source}
								value={taskForm.source}
								onChange={(e) =>
									setTaskForm({source:  e.target.value, url: taskForm.url, label: taskForm.label})
								}
							/>
							<Button
								loading={loading}
								error={error.source}
								title={"Create Task"}
							/>
						</form>
					</div>
				</PopupModal>
			)}
		</>
	);
};

export default TaskDashboard;
