import React, { useEffect, useState } from "react";
import BackTitleHeader from "../components/BackTitleHeader";
import style from "../styles/RFBT.module.css";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import QuestionComponent from "../components/QuestionComponent";
import { useRecoilState } from "recoil";
import { idtextAtom } from "../atom/atoms";
import { useParams } from "react-router-dom";
import axios from "axios";

const ReserveForm = () => {
  const [userId] = useRecoilState(idtextAtom); //로그인한 유저
  console.log("userId!!!!!!!!!!!!!" + userId);
  const params = useParams(); //sitterID
  console.log(params);

  const [caretype, setCaretype] = useState("산책");
  let today = new Date();
  today = format(today, "y-MM-dd");

  useEffect(() => {
    axios
      .get("/sitter/getSchedule", {
        params: {
          sitterId: params.sitterID,
          scheduleDay: today,
        },
      })
      .then((res) => {
        console.log(res.data);
        //케어타입이 산책인지,날짜인지 구분
        let careTypeFilltering = [];
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i]["dolbomOption"] === caretype) {
            //console.log("응애", res.data[i]["Hour"]);

            let baby = res.data[i]["Hour"];
            if (baby.dolbomStatus === 0) {
              if (baby.Hour2 === "6:00") {
                careTypeFilltering.push("06:00");
              } else if (baby.Hour2 === "7:00") {
                careTypeFilltering.push("07:00");
              } else if (baby.Hour2 === "8:00") {
                careTypeFilltering.push("08:00");
              } else if (baby.Hour2 === "9:00") {
                careTypeFilltering.push("09:00");
              } else {
                careTypeFilltering.push(baby.Hour2);
              }
            }
          }
        }
        console.log("careTypeFilltering", careTypeFilltering);
        setScheduleData(careTypeFilltering);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const handleChange = (e) => {
    //산책과 돌봄 여부 선택
    setCaretype(e.target.value);
    let sitterdate;
    if (!selectedDay) {
      sitterdate = today;
    } else {
      sitterdate = format(selectedDay, "y-MM-dd");
    }

    console.log("케어타입", caretype);
    axios
      .get("/sitter/getSchedule", {
        params: {
          sitterId: params.sitterID,
          scheduleDay: sitterdate,
        },
      })
      .then((res) => {
        console.log("날자", res.data);
        //케어타입이 산책인지,날짜인지 구분
        let careTypeFilltering = [];
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i]["dolbomOption"] === e.target.value) {
            console.log("응애", res.data[i]["Hour"]);

            let baby = res.data[i]["Hour"];
            if (baby.dolbomStatus === 0) {
              if (baby.Hour2 === "6:00") {
                careTypeFilltering.push("06:00");
              } else if (baby.Hour2 === "7:00") {
                careTypeFilltering.push("07:00");
              } else if (baby.Hour2 === "8:00") {
                careTypeFilltering.push("08:00");
              } else if (baby.Hour2 === "9:00") {
                careTypeFilltering.push("09:00");
              } else {
                careTypeFilltering.push(baby.Hour2);
              }
            }
          }
        }
        console.log("careTypeFilltering", careTypeFilltering);
        setScheduleData(careTypeFilltering);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [checkedTime, setCheckedTime] = useState([]);

  const timeCheckhandle = (e) => {
    console.log(e.target.checked, e.target.value);
  };

  const [selectedDay, setSelectedDay] = useState();
  const [scheduleData, setScheduleData] = useState([]);
  const handleSelect = (e) => {
    if (!e) {
      return;
    }
    console.log(e);
    setSelectedDay(e);
    let sitterdate = format(e, "y-MM-dd");
    axios
      .get("/sitter/getSchedule", {
        params: {
          sitterId: params.sitterID,
          scheduleDay: sitterdate,
        },
      })
      .then((res) => {
        console.log("날자", res.data);
        //케어타입이 산책인지,날짜인지 구분
        let careTypeFilltering = [];
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i]["dolbomOption"] === caretype) {
            //console.log("응애", res.data[i]["Hour"]);

            let baby = res.data[i]["Hour"];
            if (baby.dolbomStatus === 0) {
              //console.log("??", baby.Hour2 === "6:00");
              if (baby.Hour2 === "6:00") {
                careTypeFilltering.push("06:00");
              } else if (baby.Hour2 === "7:00") {
                careTypeFilltering.push("07:00");
              } else if (baby.Hour2 === "8:00") {
                careTypeFilltering.push("08:00");
              } else if (baby.Hour2 === "9:00") {
                careTypeFilltering.push("09:00");
              } else {
                careTypeFilltering.push(baby.Hour2);
              }
            }
          }
        }
        console.log("careTypeFilltering", careTypeFilltering);
        setScheduleData(careTypeFilltering);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const reserveClick = () => {
    console.log("돌봄유형", caretype);
    console.log(
      "날짜",
      typeof selectedDay === "undefined" ? today : selectedDay
    );
  };

  const [petList, setPetList] = useState("");
  const [petListOptions, setPetListOptions] = useState([]);

  const petListChange = (e) => {
    const value = e.target.value;
    setPetList(value);
  };

  useEffect(() => {
    axios({
      url: `/petProfileList/${userId}`,
      method: "get",
    })
      .then((res) => {
        console.log(res.data);
        setPetList(res.data);
        const options = res.data.map((pet) => {
          let icon = "◌";

          if (pet.petSex === "남아") {
            icon = "♂️";
          } else if (pet.petSex === "여아") {
            icon = "♀";
          }
          return {
            name: "careType",
            value: `${pet.petNo}`,
            label: `${icon} ${pet.petName} (${pet.petAge})`,
          };
        });
        setPetListOptions(options);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userId]);

  return (
    <div>
      <BackTitleHeader title="돌봄요청서" />
      <div className={style.body}>
        <p className={style.subtitle2}>돌봄 유형</p>
        <div className={style.caretypeButton}>
          <input
            type="radio"
            value="산책"
            name="caretype"
            id="산책"
            onChange={handleChange}
            checked={caretype === "산책"}
          />
          <label htmlFor="산책">산책</label>
          <input
            type="radio"
            value="돌봄"
            name="caretype"
            id="돌봄"
            onChange={handleChange}
            checked={caretype === "돌봄"}
          />
          <label htmlFor="돌봄">돌봄</label>
        </div>
        <p className={style.subtitle2}>일자</p>
        <div className={style.daypickerStyle}>
          <DayPicker
            mode="single"
            selected={selectedDay}
            onSelect={handleSelect}
          />
        </div>
        <p className={style.subtitle2}>시간</p>
        <div className={style.timetable}>
          <p className={style.subtitle3}>오전</p>
          {scheduleData.length > 0
            ? scheduleData.sort().map((item, index) => {
                if (
                  item === "12:00" ||
                  item === "13:00" ||
                  item === "14:00" ||
                  item === "15:00" ||
                  item === "16:00" ||
                  item === "17:00" ||
                  item === "18:00" ||
                  item === "19:00" ||
                  item === "20:00" ||
                  item === "21:00" ||
                  item === "22:00" ||
                  item === "23:00" ||
                  item === "24:00"
                ) {
                  return " ";
                } else
                  return (
                    <div key={index}>
                      <input
                        type="checkbox"
                        id={item}
                        value={item}
                        onChange={timeCheckhandle}
                      />
                      <label htmlFor={item}>{item}</label>
                    </div>
                  );
              })
            : " "}

          <p className={style.subtitle3}>오후</p>
          {scheduleData.length > 0
            ? scheduleData.sort().map((item, index) => {
                if (
                  item === "06:00" ||
                  item === "07:00" ||
                  item === "08:00" ||
                  item === "09:00" ||
                  item === "10:00" ||
                  item === "11:00" ||
                  item === "12:00"
                ) {
                  return " ";
                } else
                  return (
                    <div key={index}>
                      <input
                        type="checkbox"
                        id={item}
                        value={item}
                        onChange={timeCheckhandle}
                      />
                      <label htmlFor={item}>{item}</label>
                    </div>
                  );
              })
            : " "}
        </div>
        <p className={style.subtitle2}>반려견 선택</p>
        <QuestionComponent
          questionText2={"반려견 선택"}
          options={petListOptions}
          onChange={petListChange}
          selectedValue={petList}
        />
      </div>

      <div className={style.bottom}>
        <button type="button" onClick={reserveClick}>
          요청하기
        </button>
      </div>
    </div>
  );
};

export default ReserveForm;
