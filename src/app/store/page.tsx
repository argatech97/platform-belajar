"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Leaderboard from "./components/leaderboard";
import Container from "@/components/Container";
import Tab from "@/components/Tab";
import BackNavigation from "@/components/BackNavigation";
import PointHistoryList from "./components/purchaseHistory";
import RewardList from "./components/rewardList";
import {
  CreatePointHistoryDto,
  useCreatePointHistoryOnly,
  useGetMyPointByUser,
  useUpdateMyPoint,
} from "../hooks/usePointApi";
import { decrementRewardStock } from "./helper/rewardRequest";
import BottomNavigation from "../components/BottomNavigation";
import Box from "@/components/Box";

export default function Page() {
  const baseUrl = "/api/point";
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token-platform-belajar") || "" : "";
  const getMyPointByUser = useGetMyPointByUser({ baseUrl, token });
  const createPointHistory = useCreatePointHistoryOnly({ baseUrl, token });
  const updateMyPoint = useUpdateMyPoint({ baseUrl, token });

  const [selectedTab, setSelectedTab] = useState<string>("leaderboard");
  const [userId, setUserId] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  const [point, setPoint] = useState(0);
  const tab = useMemo(() => {
    return [
      { name: "Leaderboard", id: "leaderboard" },
      { name: "Tukar Reward", id: "reward" },
      { name: "Penukaran", id: "penukaran" },
      { name: "Reward Saya", id: "reward-saya" },
    ];
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user-platform-belajar") || "{}");
    setUserId(user.id);
    setUserName(user.nama_lengkap);
    getMyPointByUser(user.id).then((pointRes) => {
      setPoint(pointRes.data.point ?? 0);
    });
  }, [getMyPointByUser]);

  const redeem = useCallback(
    async (id: string, name: string, pointPrice: number) => {
      try {
        const isByPass = JSON.parse(localStorage.getItem("bypass") || "false");

        if (point < pointPrice) {
          alert("Poin anda tidak cukup");
          return;
        } else if (isByPass) {
          alert("Akun anda dilarang menukar reward");
          return;
        } else {
          const sisa = point - pointPrice;
          const x: CreatePointHistoryDto = {
            relationd_id: id,
            point: pointPrice,
            user_id: userId,
            is_earned: false,
            activity_name: `${userName} menukar poinnya dengan ${name}`,
          };

          await decrementRewardStock(id);
          await updateMyPoint(userId, { point: sisa });
          await createPointHistory(x);
          getMyPointByUser(userId).then((pointRes) => {
            setPoint(pointRes.data.point ?? 0);
          });
          alert("Kamu berhasil menukar poin dengan reward, lihat rewardmu di tab Reward Saya");
          return;
        }
      } catch (error) {
        alert(
          `Terjadi error, screenshoot error ini dan berikan kepada admin. ${(error as Error).message}`
        );
      }
    },
    [createPointHistory, getMyPointByUser, point, updateMyPoint, userId, userName]
  );

  return (
    <Container>
      <div style={{ position: "sticky", top: 0, left: 0, zIndex: 100 }}>
        <BackNavigation label={"Poin"} suffix={<div>🪙 Poin Saya : {point} </div>} />
        {selectedTab && (
          <Tab
            initialActiveTab={selectedTab}
            tabList={tab.map((type) => ({ label: type.name, value: type.id }))}
            tabOnChange={function (value: string): void {
              setSelectedTab(value);
            }}
          ></Tab>
        )}
      </div>
      {selectedTab === "leaderboard" && <Leaderboard />}
      {selectedTab === "reward" && <RewardList redeem={redeem} />}
      {selectedTab === "penukaran" && (
        <PointHistoryList
          isEarned={false}
          baseUrl={"/api"}
          token={localStorage.getItem("token-platform-belajar") || ""}
        />
      )}
      {selectedTab === "reward-saya" && userId !== "" && (
        <PointHistoryList
          isEarned={false}
          userId={userId}
          baseUrl={"/api"}
          token={localStorage.getItem("token-platform-belajar") || ""}
        />
      )}
      <Box />
      <BottomNavigation />
    </Container>
  );
}
