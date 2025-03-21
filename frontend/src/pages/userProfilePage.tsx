import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "../context/AuthContext";
import { fetchUserProfile, updateUserProfile, fetchOrderHistory } from "../lib/api";
import OrderHistory from "@/components/ui/order-history";
import { useNavigate } from "react-router-dom"; // Assuming you're using react-router-dom for navigation

const UserProfilePage: React.FC = () => {
  const { user, login, logout } = useAuth();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    dietaryPreferences: [] as string[],
  });
  const [orderHistory, setOrderHistory] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      // Fetch user profile and order history if user is logged in
      const fetchData = async () => {
        const profileData = await fetchUserProfile(user.id);
        setProfile(profileData);

        const orders = await fetchOrderHistory(user.id);
        setOrderHistory(orders);
      };
      fetchData();
    }
  }, [user?.id]);

  const handleSave = async () => {
    if (user?.id) {
      await updateUserProfile(user.id, profile);
      setIsEditing(false); // Exit edit mode after saving
    }
  };

  const handleReorder = (orderId: string) => {
    // Implement reorder functionality
    console.log("Reorder order with ID:", orderId);
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">
              Please sign in to view or edit your profile.
            </p>
            <div className="flex justify-center mt-4 space-x-4">
              <Button onClick={() => navigate("/login")}>Login</Button>
              <Button onClick={() => navigate("/signup")}>Sign Up</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              <Input
                label="Name"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
              />
              <Input
                label="Email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
              />
              <Input
                label="Dietary Preferences"
                value={profile.dietaryPreferences.join(", ")}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    dietaryPreferences: e.target.value.split(","),
                  })
                }
              />
              <Button onClick={handleSave}>Save Changes</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {profile.name}
              </p>
              <p>
                <strong>Email:</strong> {profile.email}
              </p>
              <p>
                <strong>Dietary Preferences:</strong>{" "}
                {profile.dietaryPreferences.join(", ")}
              </p>
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order History Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderHistory orders={orderHistory} onReorder={handleReorder} />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfilePage;