import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { useAppSelector } from "../../store/hooks";
import { selectToken } from "../../store/slices/authSlice";
import BackDrop from "../../components/UI/backdrop";

interface GuradProps {
  children: ReactNode;
}

const Guard: React.FC<GuradProps> = ({ children }) => {
  const [progress, setProgress] = useState(true);
  const { token } = useAppSelector(selectToken);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/signin/");
    }
    setProgress(false);
  }, []);

  if (progress) {
    return <BackDrop progress={progress} />;
  } else {
    return <>{children}</>;
  }
};

export default Guard;
