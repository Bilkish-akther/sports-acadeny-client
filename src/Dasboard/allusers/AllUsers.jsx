import { useQuery } from "@tanstack/react-query";

import Swal from "sweetalert2";
import { FaTrashAlt } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";


const AllUsers = () => {
    const [axiosSecure] = useAxiosSecure()

    const { data: users = [], refetch } = useQuery(["users"], async () => {
        const res = await axiosSecure.get('/users')
        return res.data;
    });

    const handleDelete = user => {
        // console.log(id)

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`https://sports-academi-server-nrx8uamts-bilkish-akther.vercel.app/user-delete/${user._id}`, {
                    method: 'DELETE'
                })
                    .then(res => res.json())
                    .then(data => {
                        console.log(data)
                        if (data.deletedCount > 0) {
                            refetch();
                            Swal.fire(
                                'Deleted!',
                                'Users has been deleted.',
                                'success'
                            )
                        }
                        refetch()
                    })

            }
        })

    }


    const handleMakeAdmin = id => {
        console.log(id)
        fetch(`https://sports-academi-server-nrx8uamts-bilkish-akther.vercel.app/users/admin/${id}`, {
            method: 'PATCH',
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.modifiedCount) {
                    refetch()
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'User has been Admin',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            })
    }

    const handleMakeInstructor = async user => {
    
    
        var instructor={
            "image":user.image,
            "name":user.name,
            "rating":0.0,
            "sport":"FoodBall",
            "email":user.email,
            "student":0
        }

      await  fetch(`https://sports-academi-server-nrx8uamts-bilkish-akther.vercel.app/instractor`, {
            method: 'POST',
            body: JSON.stringify(instructor),
            headers: {
          'Content-Type': 'application/json'
          }
        });

        fetch(`https://sports-academi-server-nrx8uamts-bilkish-akther.vercel.app/users/instructor/${user._id}`, {
            method: 'PATCH',
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.modifiedCount) {
                    refetch()
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'User has been on Instructor',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            })
    }


    return (
        <div className="w-11/12 mx-auto">



            <div data-aos="fade-up" className="overflow-x-auto ">
                <h3 className="text-center text-3xl mb-5 font-bold mt-14 text-black ">
                    Total User: <span className="text-red-500">{users.length}</span>
                </h3>
                <table className="table text-black  w-full">

                    {/* head */}
                    <thead>

                        <tr className="text-black text-xl">
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users.map((user, index) =>
                                <tr
                                    key={user._id}>
                                    <th>{index + 1}</th>
                                    <td>{user.displayName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role === 'admin' ? 'admin' :
                                        <button onClick={() => handleMakeAdmin(user._id)} className="btn btn-sm bg-sky-500 text-black border-0 ">Admin</button>
                                    } </td>
                                    <td>{user.role === 'instructor' ? 'instructor' :
                                        <button onClick={() => handleMakeInstructor(user)} className="btn btn-sm bg-sky-500 text-black border-0 ">instructor</button>
                                    } </td>


                                    <td><button onClick={() => handleDelete(user)} className="btn btn-sm bg-red-500 text-black border-0 "><FaTrashAlt></FaTrashAlt> </button></td>
                                </tr>
                            )
                        }


                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllUsers;
