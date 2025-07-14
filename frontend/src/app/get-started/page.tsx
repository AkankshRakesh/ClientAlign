import { Suspense } from "react";
import GetStartedClient from "./GetStartedClient";

export default function GetStartedPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GetStartedClient />
    </Suspense>
  );
}
  