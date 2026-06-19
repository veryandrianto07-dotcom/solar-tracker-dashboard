"use client";

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";

import {
  FaBatteryThreeQuarters,
  FaSun,
  FaCog,
} from "react-icons/fa";

export default function Home() {
  const [data, setData] = useState<any>({});

  useEffect(() => {
    const monitorRef = ref(db, "solarTracker/monitoring");

    return onValue(monitorRef, (snapshot) => {
      const firebaseData = snapshot.val() || {};
      setData(firebaseData);
    });
  }, []);

  const batteryPercent = data.batteryPercentage || 0;

  const ldrValues = [
    data.ldr1 || 0,
    data.ldr2 || 0,
    data.ldr3 || 0,
    data.ldr4 || 0,
  ];

  const maxLdr = Math.max(...ldrValues);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-sky-400">
            ☀ Solar Tracker Dashboard
          </h1>

          <p className="text-slate-400">
            Firebase Realtime Monitoring
          </p>
        </div>

        <div className="bg-green-600 px-4 py-2 rounded-xl font-bold">
          ONLINE
        </div>
      </div>

      {/* STATUS */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">

        <Card
          title="Battery Voltage"
          value={`${data.batteryVoltage || 0} V`}
          icon={<FaBatteryThreeQuarters />}
        />

        <Card
          title="Battery Percentage"
          value={`${data.batteryPercentage || 0} %`}
          icon={<FaBatteryThreeQuarters />}
        />

        <Card
          title="Estimated Current"
          value={`${data.estimatedCurrent || 0} A`}
          icon={<FaBatteryThreeQuarters />}
        />

        <Card
          title="Estimated Power"
          value={`${data.estimatedPower || 0} W`}
          icon={<FaSun />}
        />

      </div>

      {/* BATTERY BAR */}
      <div className="bg-slate-900 rounded-2xl p-6 mb-8">

        <h2 className="text-xl font-bold mb-4">
          Battery Status
        </h2>

        <div className="w-full bg-slate-700 rounded-full h-8">

          <div
            className="bg-green-500 h-8 rounded-full flex items-center justify-center font-bold"
            style={{
              width: `${batteryPercent}%`,
            }}
          >
            {batteryPercent}%
          </div>

        </div>

      </div>

      {/* LDR */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">

        <LdrCard
          title="LDR 1 (RIGHT)"
          value={data.ldr1 || 0}
          active={data.ldr1 === maxLdr}
        />

        <LdrCard
          title="LDR 2 (LEFT)"
          value={data.ldr2 || 0}
          active={data.ldr2 === maxLdr}
        />

        <LdrCard
          title="LDR 3 (UP)"
          value={data.ldr3 || 0}
          active={data.ldr3 === maxLdr}
        />

        <LdrCard
          title="LDR 4 (DOWN)"
          value={data.ldr4 || 0}
          active={data.ldr4 === maxLdr}
        />

      </div>

      {/* TRACKER STATUS */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">

        <Card
          title="Horizontal Direction"
          value={data.horizontalDirection || "STOP"}
          icon={"↔️"}
        />

        <Card
          title="Vertical Direction"
          value={data.verticalDirection || "STOP"}
          icon={"↕️"}
        />

        <Card
          title="Servo Angle"
          value={`${data.servoAngle || 90}°`}
          icon={<FaCog />}
        />

      </div>

      {/* VISUAL TRACKER */}
      <div className="bg-slate-900 rounded-2xl p-8">

        <h2 className="text-xl font-bold mb-6">
          Solar Tracker Status
        </h2>

        <div className="flex justify-center text-7xl animate-pulse">
          ☀
        </div>

        <div className="text-center mt-6">

          <p className="text-green-400 font-bold text-xl">
            Tracking Active
          </p>

          <p className="text-slate-400 mt-2">
            Horizontal :
            {" "}
            {data.horizontalDirection || "STOP"}
          </p>

          <p className="text-slate-400">
            Vertical :
            {" "}
            {data.verticalDirection || "STOP"}
          </p>

        </div>

      </div>

    </main>
  );
}

function Card({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: any;
}) {
  return (
    <div className="bg-slate-900 rounded-2xl p-5">

      <div className="text-sky-400 text-2xl mb-2">
        {icon}
      </div>

      <h3 className="text-slate-400">
        {title}
      </h3>

      <p className="text-2xl font-bold mt-2 break-words">
        {value}
      </p>

    </div>
  );
}

function LdrCard({
  title,
  value,
  active,
}: {
  title: string;
  value: number;
  active: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-5 ${
        active
          ? "bg-green-700"
          : "bg-slate-900"
      }`}
    >

      <h3 className="font-bold">
        {title}
      </h3>

      <p className="text-3xl mt-2">
        {value} Lux
      </p>

      {active && (
        <p className="mt-2 text-sm font-bold">
          ACTIVE
        </p>
      )}

    </div>
  );
}
