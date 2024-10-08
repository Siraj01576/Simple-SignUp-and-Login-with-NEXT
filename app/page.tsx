"use client"
import { useEffect, useState } from 'react';
import { UserCard } from "@/components/usercard";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation';

type AuthData = {
  user: {
    name: string;
    username: string;
  };
};

const checkAuth = async (token: string | undefined): Promise<AuthData | null> => {
  try {
    if (token) {
      const response = await axios.get("/api/verify-token", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.isValid) {
        return response.data;
      }
    }
    return null;
  } catch (error) {
    return null;
  }
};

export default function Home() {
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("authToken");

    const fetchAuthData = async () => {
      const data = await checkAuth(token);
      if (!data) {
        router.push('/signin');
      } else {
        setAuthData(data);
      }
      setLoading(false);
    };

    fetchAuthData();
  }, [router]);

  if (loading) {
    return (
    <div className="w-[100vw] h-[100vh] flex justify-center items-center">
      <div className='text-white'>Loading...</div>
    </div>
    )
  }

  if (!authData) {
    return <div>Redirecting to <a href="/signin">signin</a>...</div>;
  }

  return (
    <div className="w-[100vw] h-[100vh] flex justify-center items-center">
      <UserCard name={authData.user.name} email={authData.user.username} />
    </div>
  );
}
