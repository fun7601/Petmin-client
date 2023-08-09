import React, { useEffect, useState } from "react";
import BackTitleHeader from "../../components/BackTitleHeader";
import axios from "axios";
import pngwing from "../../assets/images/Main/pngwing.com.png";
import { NoData } from "../../assets";
import Lottie from "lottie-react";

const { kakao } = window;

export default function Hospital() {
  const [loc, setLoc] = useState("");
  const [Keyword, setKeyword] = useState("");
  const [mapData, setmapData] = useState();
  const [mList, setMList] = useState();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  let imageSrc = "";
  // 입력 폼 변화 감지하여 입력 값을 state에 담아주는 함수
  const keywordChange = (e) => {
    e.preventDefault();
    setLoc(e.target.value);
  };

  const submitKeyword = (e) => {
    e.preventDefault();
    setKeyword(loc);

    axios
      .get(`/hospitals/maplist?searchTerm=${loc}`)
      .then((res) => {
        setMList(res.data.hospitals);
        // setIsValid(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const valueChecker = () => {
    if (loc === "") {
      alert("검색어를 입력해주세요.");
    }
  };

  useEffect(() => {
    // 마커를 클릭하면 장소명을 표출할 인포윈도우 입니다
    var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

    var mapContainer = document.getElementById("map"), // 지도를 표시할 div
      mapOption = {
        center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
        level: 3, // 지도의 확대 레벨
      };

    // 지도를 생성합니다
    var map = new kakao.maps.Map(mapContainer, mapOption);

    // 장소 검색 객체를 생성합니다
    var ps = new kakao.maps.services.Places();

    // 키워드로 장소를 검색합니다
    ps.keywordSearch(loc, placesSearchCB);

    // 키워드 검색 완료 시 호출되는 콜백함수 입니다
    function placesSearchCB(data, status, pagination) {
      if (status === kakao.maps.services.Status.OK) {
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        var bounds = new kakao.maps.LatLngBounds();

        for (var i = 0; i < data.length; i++) {
          bounds.extend(new kakao.maps.LatLng(data[i]?.y, data[i].x));
        }

        for (let i = 0; i < mList.length; i++) {
          displayMarkers(mList[i]);
        }
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
        map.setBounds(bounds);
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        alert("검색 결과가 존재하지 않습니다.");
        return;
      } else if (status === kakao.maps.services.Status.ERROR) {
        alert("검색 결과 중 오류가 발생했습니다.");
        return;
      }
    }

    // 지도에 마커를 표시합니다
    const displayMarkers = (data) => {
      const markerPosition = new kakao.maps.LatLng(
        data.refine_WGS84_LAT,
        data.refine_WGS84_LOGT
      );

      var imageSrc = "";
      var imageSize = new kakao.maps.Size(24, 35), // 마커이미지의 크기입니다
        imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
      data.hospitalPartner === true
        ? (imageSrc =
            "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png") // 마커이미지의 주소입니다
        : (imageSrc = pngwing); // 마커이미지의 주소입니다

      // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
      var markerImage = new kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imageOption
      );

      // 마커를 생성합니다
      var marker = new kakao.maps.Marker({
        position: markerPosition,
        image: markerImage, // 마커이미지 설정
      });

      // 마커가 지도 위에 표시되도록 설정합니다

      // 커스텀 오버레이에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
      var content =
        `<div class="customoverlay">` +
        `    <span class="title">${data.bizplc_NM}</span>` +
        "</div>";

      var clusterer = new kakao.maps.MarkerClusterer({
        map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체
        averageCenter: false, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
        minLevel: 5, // 클러스터 할 최소 지도 레벨
      });

      // 커스텀 오버레이가 표시될 위치입니다
      var position = new kakao.maps.LatLng(
        data.refine_WGS84_LAT,
        data.refine_WGS84_LOGT
      );

      // 커스텀 오버레이를 생성합니다
      var customOverlay = new kakao.maps.CustomOverlay({
        map: map,
        position: position,
        content: content,
        yAnchor: 1,
      });

      // clusterer.addMarkers(marker);
      marker.setMap(map);
    };

    //map
    // 지도에 확대 축소 컨트롤을 생성한다
    let zoomControl = new kakao.maps.ZoomControl();

    // 지도의 우측에 확대 축소 컨트롤을 추가한다
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
  }, [mList]);
  // const [isValid, setIsValid] = useState(true);

  return (
    <div>
      {/* <BackTitleHeader title="병원목록" /> */}
      <form onSubmit={submitKeyword}>
        <label htmlFor="place">
          <div
            style={{
              position: "relative",
              display: "block",
              backgroundColor: "#EFEFEF",
            }}
          >
            <div
              style={{
                position: "relative",
                height: "42px",
                zIndex: "110",
                height: "42px",
                paddingLeft: "45px",
                border: "2px solid #FF6666",
                borderRadius: "5px",
              }}
            >
              <input
                type="submit"
                value="검색"
                onClick={valueChecker}
                style={{
                  border: "none",
                  backgroundImage: `url(https://ssl.pstatic.net/static/maps/v5/pc/20230602131202/search@2x.png)`,
                  overflow: "hidden",
                  display: "inline-block",
                  width: "25px",
                  height: "24px",
                  fontSize: "0",
                  color: "transparent",
                  verticalAlign: "top",
                  backgroundPosition: "-26px -112px",
                  position: "absolute",
                  top: "9px",
                  left: "15px",
                  backgroundSize: "194px 190px",
                }}
              />
              <label
                style={{
                  color: "#d8d8d8",
                  position: "absolute",
                  top: "0",
                  left: "60px",
                  right: "0",
                  bottom: "0",
                  zIndex: "-1",
                  lineHeight: "44px",
                  fontWeight: "400",
                }}
                htmlFor="search"
              ></label>

              {/* <SearchIcon /> */}
              <input
                id="search"
                type="text"
                name="place"
                onChange={keywordChange}
                placeholder="   검색어를 입력해주세요. (ex: 원종동)"
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  top: "0",
                  left: "60px",
                  right: "100px",
                  bottom: "12px",
                  zIndex: "-1",
                  border: "0 solid #D2D2D2",
                  width: "3000px",
                  height: "40px",
                  flexShrink: "0",
                  backgroundColor: "transparent",
                }}
                required
              />
            </div>
          </div>
        </label>
      </form>
      <div
        id="map"
        style={{
          width: "100vw",
          height: "100vh",
          // maxHeight: !isValid ? "500px" : "1000px",
          maxHeight: "500px",
        }}
      ></div>

      {mList?.length === 0 ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          <Lottie
            options={defaultOptions}
            animationData={NoData}
            style={{
              position: "absolute",
              top: "-60px",
              height: "500px",
              width: "300px",
            }}
          />
        </div>
      ) : (
        <ul>
          {mList?.map((data) => {
            return (
              <li
                style={{
                  borderBottom: "1px solid #FF6666",
                  padding: "21px 25px 18px",
                  background: "#fafcff",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    float: "right",
                    marginLeft: "15px",
                  }}
                >
                  {data.hospitalPartner === true ? (
                    <img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png" />
                  ) : (
                    <img width={24} height={35} src={pngwing} />
                  )}
                </div>
                <div
                  style={{
                    fontWeight: "700",
                    letterSpacing: "-1px",
                    marginRight: "6px",
                    fontSize: "1.4rem",
                  }}
                >
                  {data.bizplc_NM}
                </div>
                <div
                  style={{
                    marginTop: "8px",
                    whiteSpace: "nowrap",
                    display: "block",
                  }}
                >
                  <span
                    style={{
                      position: "relative",
                      fontSize: "1.2rem",
                      letterSpacing: "-0.1px",
                    }}
                  >
                    Tel :{" "}
                    {data.locplc_FACLT_TELNO?.length > 1
                      ? data.locplc_FACLT_TELNO
                      : "❌"}
                  </span>
                </div>
                <div
                  style={{
                    marginTop: "8px",
                    // whiteSpace: "nowrap",
                    display: "block",
                  }}
                >
                  <span
                    style={{
                      position: "relative",
                      fontSize: "1rem",
                      letterSpacing: "-0.1px",
                    }}
                  >
                    {data.refine_LOTNO_ADDR}
                  </span>
                </div>
              </li>
              // FCAEAE
            );
          })}
        </ul>
      )}
    </div>
  );
}
