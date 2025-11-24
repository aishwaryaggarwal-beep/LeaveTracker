import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import apiClient from "../api/apiClient";


export default function Profile({ auth }) {
const [profile, setProfile] = useState(null);


if (!auth) return <Navigate to="/login" />;


useEffect(() => {
apiClient.getProfile(auth.user.id).then(setProfile);
}, []);


return (
<div className="p-6">
<h1 className="text-xl font-bold mb-4">My Profile</h1>


{profile ? (
<div className="bg-white p-4 rounded shadow">
<p><strong>Name:</strong> {profile.name}</p>
<p><strong>Email:</strong> {profile.email}</p>
<p><strong>Department:</strong> {profile.department}</p>
<p><strong>Joining Date:</strong> {profile.joiningDate}</p>
</div>
) : <p>Loading...</p>}
</div>
);
}