import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import './styles.css';
import React, { FC, forwardRef } from 'react';
import { fetchUserInfo} from '@/requests/requests';
import { useEffect, useState, ChangeEvent } from 'react';

interface AvatarProps {
  style?: React.CSSProperties;
}

const TabsDemo: FC<AvatarProps> = forwardRef((_, ref) => {

  const [user, setUser] = useState<{
    username: string
    email: string
  }>(() => {
    // Get user info from localStorage if available
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : { user: '', email: '' };
  });

  const endSession = () => {
    // Clear token and user info
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to login
    window.location.href = '/login';
  };

  useEffect(() => {
    // Fetch user info
    const fetchData = async () => {
     
      const data = await fetchUserInfo();
      
      setUser(data);
      
    };

    fetchData();
  }, []);

  return (
    <Tabs defaultValue="account" className="tabs-container">
      <TabsContent value="account" className="tabs-content">
        <Card className="card">
          <CardHeader className="card-header">
            <CardTitle className="card-title">Account</CardTitle>
            <CardDescription className="card-description">
              User information.
            </CardDescription>
          </CardHeader>
          <CardContent className="card-content space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name" className="label">Name</Label>
              <div id="name" className="non-editable-input">{user.username}</div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="email" className="label">Email</Label>
              <div id="email" className="non-editable-input">{user.email}</div>
            </div>
          </CardContent>
          <CardFooter className="card-footer">
            <Button className="button" onClick={endSession}>End Session</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
});

export default TabsDemo;