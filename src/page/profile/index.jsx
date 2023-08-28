import React from "react";
import Navbar from "../../component/navbar";
import Footer from "../../component/footer";
import loyalty from "../../assets/loyalty.jpg"
import { Link } from "react-router-dom";
import { useState } from "react";
import { Show } from "../../helpers/toast";
import { useNavigate } from "react-router-dom";
import useApi from "../../helpers/useApi";
import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addData } from "../../store/reducer/user";

function Profile() {
    const { data, isAuth } = useSelector((s) => s.users)
    const navigate = useNavigate()
    const api = useApi()
    const [selectedFile, setSelectedFile] = useState(null);
    const inputChange = (e) => {
        const data = { ...form };
        data[e.target.name] = e.target.value;
        setForm(data);
    };


    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };
    const fetchUser = async () => {
        try {
            const { data } = await api.get('http://localhost:8081/user/');
            dispatch(addData(data.data));
        } catch (error) {
            console.log(error);
        }
    };
    const validateForm = () => {
        const newErrors = {};
        if (form.email_user) {
            if (!form.email_user.includes("@")) {
                newErrors.email_user = "Please enter a valid email address";
            }
        }
        if (form.password) {
            if (form.password.length < 6) {
                newErrors.password = "Password must be at least 6 characters long";
            }
        }
        if (form.password && form.confirm_password !== form.password) {
            newErrors.confirm_password = "Passwords do not match";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const [form, setForm] = useState({});
    const Update = (e) => {
        e.preventDefault();
        if (validateForm()) {
            api({
                method: 'PATCH',
                url: '/user',
                data: form,
            })
                .then(({ data }) => {
                    Show('Data Updated', 'success');
                    setTimeout(() => {
                        window.location.reload();
                    }, 3050);
                })
                .catch((err) => {
                    const axiosErr = err.response.data;
                    if (axiosErr.message !== undefined) {
                        Show(axiosErr.message, 'warning');
                    } else if (axiosErr.error !== undefined) {
                        Show(axiosErr.error, 'error');
                    }
                });
        }
    };
    const UpdateImage = async () => {
        try {
            if (selectedFile) {
                const formData = new FormData();
                formData.append("image_user", selectedFile);

                const { data } = await api({
                    url: "/user/image",
                    method: "PATCH",
                    data: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

            }

            Show("Image updated successfully", "success");
            window.location.reload();

        } catch (error) {
            console.error("Error updating image:", error);
            Show("Error updating image", "error");
        }
    };

    useEffect(() => {
        if (isAuth) {
            fetchUser();
        }
    }, [isAuth]);
    useEffect(() => {
        if (!isAuth) {
            navigate('/')
        }
    }, [])
    return (
        <>
            <Navbar />
            <main className="bg-background w-full  flex flex-col lg:flex-row mx-auto py-5 px-10 gap-x-10">
                <div className="lg:hidden bg-white rounded-lg py-5 px-5 mb-5 flex flex-row justify-around">
                    <Link to="/profile" className="font-medium border-b-2 border-blue-700">Account Settings</Link>
                    <Link to="/profile/history">Order History</Link>
                </div>
                <div className="w-full lg:w-1/4 bg-white rounded-lg flex flex-col items-center pt-5 pb-5">
                    <p className="text-left mb-3 font-bold">INFO</p>
                    <div className="flex flex-col justify-center items-center relative group">
                        <div className="h-28 w-28">
                            <img src={data.image_user} className="cursor-pointer w-full h-full object-cover rounded-full" alt="profile_picture" />
                        </div>
                        <p className="btn mt-10" onClick={UpdateImage} >update image</p>
                        <span className="flex items-center gap-4 mt-3">
                            <input type="file" name="image_user" onChange={handleFileChange} />
                        </span>
                    </div>
                    <p className="font-bold text-xl mt-5">{`${data.first_name} ${data.last_name}`}</p>
                    <p className="mt-5">Moviegoers</p>
                    <hr className="border-gray-300 my-3 w-full" />
                    <img className="mt-5" src={loyalty} alt="" />
                    <p className="mt-5 mb-5">180 points become a master</p>
                    <progress className="progress progress-info w-56 mb-5" value="40" max="100"></progress>
                    <p className="btn lg:hidden" onClick={() => window.my_modal_2.showModal()}>Edit Profile</p>
                    <dialog id="my_modal_2" className="modal">
                        <form method="dialog" className="modal-box">
                            <div className="bg-white rounded-lg py-5 px-5">
                                <p>Details Information</p>
                                <hr className="border-gray-300 my-3 w-full" />
                                <div className="form-card flex flex-col md:flex-row flex-wrap ml-8 mt-12 mr-8 pb-16">
                                    <div className="form w-full md:w-1/2">
                                        <p className="mb-3">First Name</p>
                                        <input
                                            name="first_name"
                                            type="text"
                                            className="border border-gray rounded-lg w-3/4 text-black px-3 py-3 mb-6 "
                                            placeholder="Jonas"
                                            onChange={inputChange}
                                        />
                                    </div>
                                    <div className="form w-full md:w-1/2">
                                        <p className="mb-3">Last Name</p>
                                        <input
                                            name="last_name"
                                            type="text"
                                            className="border border-gray rounded-lg w-3/4 text-black px-3 py-3 mb-6 "
                                            placeholder="Jonas"
                                            onChange={inputChange}
                                        />
                                    </div>
                                    <div className="form w-full md:w-1/2">
                                        <p className="mb-3">E-mail</p>
                                        <input
                                            name="email_user"
                                            type="text"
                                            className="border border-gray rounded-lg w-3/4 text-black px-3 py-3 mb-6 "
                                            placeholder="Jonas"
                                            onChange={inputChange}
                                        />
                                        {errors.email_user && (
                                            <p className="text-red-500">{errors.email_user}</p>
                                        )}
                                    </div>
                                    <div className="form w-full md:w-1/2">
                                        <p className="mb-3">Phone Number</p>
                                        <input
                                            name="phone_number"
                                            type="text"
                                            className="border border-gray rounded-lg w-3/4 text-black px-3 py-3 mb-6 "
                                            placeholder="Jonas"
                                            onChange={inputChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg pb-5 px-5">
                                <p>Accounts & privacy</p>
                                <hr className="border-gray-300 my-3 w-full" />
                                <div className="flex flex-col md:flex-row gap-y-6 gap-x-8">
                                    <     div className="w-full  md:w-1/2 ml-8">
                                        <h3>New Password</h3>
                                        <input
                                            name="password"
                                            className="border border-gray rounded-lg w-3/4 px-3 py-3"
                                            type="password"
                                            placeholder="Write Your New Password"
                                            onChange={inputChange}
                                        />
                                        {errors.password && (
                                            <p className="text-red-500">{errors.password}</p>
                                        )}
                                    </div>
                                    <div className="w-full md:w-1/2 ml-8 ">
                                        <h3>Confirm Password</h3>
                                        <input
                                            name="confirm_password"
                                            className="border border-gray rounded-lg w-3/4 px-3 py-3"
                                            type="password"
                                            placeholder="Confirm Your New Password"
                                            onChange={inputChange}
                                        />
                                        {errors.confirm_password && (
                                            <p className="text-red-500">{errors.confirm_password}</p>
                                        )}
                                    </div>
                                </div>
                                <button className="btn bg-blue-500 w-full mt-5 text-white font-medium" onClick={Update}>Update Changes</button>
                            </div>
                        </form>
                        <form method="dialog" className="modal-backdrop">
                            <button>close</button>
                        </form>
                    </dialog>
                </div>
                <div className="w-3/4 hidden lg:flex flex-col gap-y-10">
                    <div className="bg-white rounded-lg py-5 px-5 ">
                        <Link to="/profile" className="mr-5 font-medium border-b-2 border-blue-700 py-5">Account Settings</Link>
                        <Link to="/profile/history">Order History</Link>
                    </div>
                    <div className="bg-white rounded-lg py-5 px-5">
                        <p>Details Information</p>
                        <hr className="border-gray-300 my-3 w-full" />
                        <div className="form-card flex flex-col md:flex-row flex-wrap ml-8 mt-12 mr-8 pb-16">
                            <div className="form w-full md:w-1/2">
                                <p className="mb-3">First Name</p>
                                <input
                                    name="first_name"
                                    type="text"
                                    className="border border-gray rounded-lg w-3/4 text-black px-3 py-3 mb-6 "
                                    placeholder="Jonas"
                                    onChange={inputChange}
                                />
                            </div>
                            <div className="form w-full md:w-1/2">
                                <p className="mb-3">Last Name</p>
                                <input
                                    name="last_name"
                                    type="text"
                                    className="border border-gray rounded-lg w-3/4 text-black px-3 py-3 mb-6 "
                                    placeholder="Jonas"
                                    onChange={inputChange}
                                />
                            </div>
                            <div className="form w-full md:w-1/2">
                                <p className="mb-3">E-mail</p>
                                <input
                                    name="email_user"
                                    type="text"
                                    className="border border-gray rounded-lg w-3/4 text-black px-3 py-3 mb-6 "
                                    placeholder="Jonas"
                                    onChange={inputChange}
                                />
                                {errors.email_user && (
                                    <p className="text-red-500">{errors.email_user}</p>
                                )}
                            </div>
                            <div className="form w-full md:w-1/2">
                                <p className="mb-3">Phone Number</p>
                                <input
                                    name="phone_number"
                                    type="text"
                                    className="border border-gray rounded-lg w-3/4 text-black px-3 py-3 mb-6 "
                                    placeholder="Jonas"
                                    onChange={inputChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg py-5 px-5">
                        <p>Accounts & privacy</p>
                        <hr className="border-gray-300 my-3 w-full" />
                        <div className="flex flex-col md:flex-row gap-y-6 gap-x-8">
                            <     div className="w-full  md:w-1/2 ml-8">
                                <h3>New Password</h3>
                                <input
                                    name="password"
                                    className="border border-gray rounded-lg w-3/4 px-3 py-3"
                                    type="password"
                                    placeholder="Write Your New Password"
                                    onChange={inputChange}
                                />
                                {errors.password && (
                                    <p className="text-red-500">{errors.password}</p>
                                )}
                            </div>
                            <div className="w-full md:w-1/2 ml-8 ">
                                <h3>Confirm Password</h3>
                                <input
                                    name="confirm_password"
                                    className="border border-gray rounded-lg w-3/4 px-3 py-3"
                                    type="password"
                                    placeholder="Confirm Your New Password"
                                    onChange={inputChange}
                                />
                                {errors.confirm_password && (
                                    <p className="text-red-500">{errors.confirm_password}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <button className="btn bg-blue-500 w-1/4 text-white font-medium" onClick={Update}>Update Changes</button>
                </div>
            </main>
            <Footer />
        </>
    )
}

export default Profile