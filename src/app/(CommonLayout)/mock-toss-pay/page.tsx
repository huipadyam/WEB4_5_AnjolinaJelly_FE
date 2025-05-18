"use client";

import { Suspense } from "react";
import MockTossPayPageInner from "./MockTossPayPageInner";

export default function MockTossPayPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <MockTossPayPageInner />
    </Suspense>
  );
}
