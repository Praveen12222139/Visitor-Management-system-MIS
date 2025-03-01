import axios from "axios";
import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [visitors, setVisitors] = useState({
    pending: [],
    approved: [],
    preApproved: [],
    rejected: [],
    expired: [],
  });

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const token = localStorage.getItem("token");
        const hostEmail = localStorage.getItem("hostEmail");
        if (!hostEmail) return;
        const response = await axios.get(`https://visitormaback.vercel.app/appoint/find/${hostEmail}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const categorizedVisitors = {
          pending: [],
          approved: [],
          preApproved: [],
          rejected: [],
          expired: [],
        };

        response.data.forEach((visitor) => {
          const key = visitor.status.toLowerCase().replace("-", "");
          if (categorizedVisitors[key]) {
            categorizedVisitors[key].push(visitor);
          }
        });

        setVisitors(categorizedVisitors);
      } catch (error) {
        console.error("Error fetching visitors:", error);
      }
    };

    fetchVisitors();
  }, []);

  const handleAction = async (visitorId, action) => {
    try {
      await axios.post(
        `https://visitormaback.vercel.app/appoint/approve/${visitorId}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setVisitors((prev) => ({
        ...prev,
        pending: prev.pending.filter((v) => v._id !== visitorId),
      }));
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Object.entries(visitors).map(([status, list]) => (
        <div
          key={status}
          className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
        >
          {/* Gradient Header */}
          <h2 className="text-xl font-bold text-center capitalize border-b border-gray-300 pb-3 px-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-xl">
            {status} Visitors
          </h2>
          <div className="p-4">
            {list.length > 0 ? (
              list.map((visitor) => (
                <div
                  key={visitor._id}
                  className="p-4 border-b last:border-b-0 border-gray-200 hover:bg-gray-50 transition-all duration-200"
                >
                  <p className="text-gray-800">
                    <strong>Name:</strong> {visitor.fullName}
                  </p>
                  <p className="text-gray-700">
                    <strong>Email:</strong> {visitor.email}
                  </p>
                  <p className="text-gray-700">
                    <strong>Status:</strong>{" "}
                    <span className="font-medium text-gray-800">
                      {visitor.status}
                    </span>
                  </p>
                  {status === "pending" && (
                    <div className="flex space-x-3 mt-3">
                      <button
                        onClick={() => handleAction(visitor._id, "preapprove")}
                        className="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition duration-200"
                      >
                        Pre-Approve
                      </button>
                      <button
                        onClick={() => handleAction(visitor._id, "approve")}
                        className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition duration-200"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(visitor._id, "reject")}
                        className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition duration-200"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No visitors found.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
  
  );
};

export default Dashboard;
