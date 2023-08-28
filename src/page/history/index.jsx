import React, { useState } from "react";
import Navbar from "../../component/navbar";
import Footer from "../../component/footer";
import Ticketscard from "../../component/tickets";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import useApi from "../../helpers/useApi";
import { Show } from "../../helpers/toast";
import loyalty from "../../assets/loyalty.jpg"
import { useDispatch } from "react-redux";
import { addData } from "../../store/reducer/user";
import Pagination from "../../component/pagination"

function History() {
  const dispatch = useDispatch()
  const { data, isAuth } = useSelector((s) => s.users)
  const [selectedFile, setSelectedFile] = useState(null);
  const [booking, setBooking] = useState([])
  const [pageactive, setpageactive] = useState(1)
  const [metabooking, setmetabooking] = useState([]);
  const api = useApi()
  const navigate = useNavigate()

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
  const getBooking = async () => {
    try {
      const { data } = await api({
        method: "GET",
        url: `/bookings/user/?limit=2&page=${pageactive}`
      });

      setmetabooking(data.meta)
      setBooking(data.data);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(metabooking)
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
    getBooking();
  }, [isAuth, pageactive]);

  useEffect(() => {
    getBooking();
    if (!isAuth) {
      navigate('/')
    }
  }, [])


  return (
    <>
      <Navbar />
      <main className="bg-background w-full flex flex-row mx-auto py-5 px-10 gap-x-10 ">
        <div className="w-1/4 bg-white rounded-lg flex flex-col items-center justify-center pt-5 pb-5 h-full hidden lg:flex">
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
          <p className="font-bold text-xl mt-5 text-center">{`${data.first_name} ${data.last_name}`}</p>
          <p className="mt-5 text-center">Moviegoers</p>
          <hr className="border-gray-300 my-3 w-full" />
          <img className="mt-5" src={loyalty} alt="Loyalty" />
          <p className="mt-5 mb-5 text-center">180 points become a master</p>
          <progress className="progress progress-info w-56 mb-5" value="40" max="100"></progress>
        </div>
        <div className="w-3/4 flex flex-col gap-y-10">
          <div className="bg-white rounded-lg py-5 px-5 flex justify-around md:justify-normal">
            <Link to="/profile" className="">Account Settings</Link>
            <Link to="/profile/history" className="ml-5 font-medium border-b-2 border-blue-700 ">Order History</Link>
          </div>
          {booking ? (
            booking.map((v) => {
              const time_a = v.schedule[0].time_schedule.split(":")[0] + ":" + v.schedule[0].time_schedule.split(":")[1] + " WIB"
              return <Ticketscard premier={v.schedule[0].image_premier} title={v.schedule[0].title} date={v.schedule[0].set_date} time={time_a} seats={v.seats} total={v.total} />
            })) :
            (<h1>Data Not Found</h1>)}
          <div className="flex pt-10 justify-around">
            <Pagination meta={metabooking} page_active={pageactive} set_page_active={setpageactive} />
          </div>
        </div>

      </main >
      <Footer />
    </>
  )
}

export default History