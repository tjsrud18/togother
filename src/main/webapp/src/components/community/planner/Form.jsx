import React, { useEffect, useRef, useState } from 'react';
import { addPlanner,addSubItem,addPlannerText,addPlannerImage,uploadPlannerImage } from '../../../api/PlannerApiService';
import { getCityList } from '../../../api/CityApiService';
import { addCustomPlace } from '../../../api/PlaceApiService';
import { addTogether } from '../../../api/TogetherApiService';
import Nday from './Nday';
import styles from '../../../css/planner.module.css'
import Togother from './Togother';
import TogoItemList from './TogoItemList';
import xBut from '../../../assets/image/xBut.png';
import arrow from '../../../assets/image/arrow.png'
import { GoogleMap, LoadScript, Autocomplete, GroundOverlay } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';

const libraries = ["places"];

const Form = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const date = today.getDate().toString().padStart(2, '0');
    const nowDay = `${year}-${month}-${date}`;

    const navigate = useNavigate()

    const toSeq = useRef(0);
//나중에 plannerDTO로 들어갈것들
    const [publicPaln,setPublicPlan] = useState(true)
    //날짜
    const [startDate,setStartDay] = useState(nowDay)
    const [endDate,setEndDay] = useState(nowDay)
    //
    const [dDay,setDDay] = useState([])

    //DTO 정보들
    const [subDTO,setSubDTO] = useState([])
    const [togoDTO,setTogoDTO] = useState([])
    const [textDTO,setTextDTO] = useState([])
    const[city,setCity] = useState([])

    //실시간 가지고있는 값
    const [tabNum,setTabNum] = useState(1)
    const [toNum,setToNum] = useState(0)

    //플래너 이름 자동 생성 매커니즘
    const [plannerTitle,setPlannerTitle] = useState([])

    useEffect(()=>{
        const getPlaces = subDTO.filter(item => item.place !== null).slice().sort((a, b) => a.nDay - b.nDay).map(item2 => item2.place.citySeq)

        const getPlaces2 = new Set(getPlaces)

        setPlannerTitle([...getPlaces2])
    },[subDTO])
    //동행리스트
    const [toList,setToList] = useState(0)
    const onToList = (seq) => {
        setToList(seq)
    }
    //플래너 업로드 
    const uploadPlanner = () => {
        const delTogo = [];

        togoDTO.map(item => {
            if(item.title === '') delTogo.push(item.seq)
            else if(item.context === '') delTogo.push(item.seq)
            else if(subDTO.findIndex(item2 => item2.toNum === item.seq) === -1) delTogo.push(item.seq)
        })

        if(delTogo.length > 0) {
            if(window.confirm(delTogo.length + 
                '건의 작성 되지않은 동행이 있습니다. 삭제하고 저장하시겠습니까?')) {
                    Promise.all(delTogo.map(item => onToDelete(item)))
                }else return;
        }

        let title = `인호의 ${plannerTitle.length > 0 ? //이름 나중에 유저 세션 이름으로
            city.find(item => item.citySeq === plannerTitle[0]).cityName : ''}${
            plannerTitle.length > 1 ? ` 외 ${plannerTitle.length - 1}곳` : ''} 여행 플래너`;

        let citySeq = -1;
        if(plannerTitle.length > 0 ) citySeq = plannerTitle[0];

        const planner = {title: title,startDate: startDate,citySeq : citySeq,
        endDate: endDate,publicPlan : publicPaln ? 0 : 1,hit : 0,likeCnt : 0}

        addPlanner(planner)
        .then(res => {
            console.log(res.data)
            subDTO.filter(item2 => item2.toNum === undefined).map(item => {
                if(item.place !== null) {
                    const subItem = {plMainSeq: res.data, nday: item.nDay, code : item.code,
                    startTime : item.startTime, endTime : item.endTime, context : item.context,
                    placeSw: 0, placeSeq: item.place.placeSeq }
                    addSubItem(subItem)
                    .then(res2 => console.log(res2))
                    .catch(e => console.log(e))
                }
                if(item.customDTO !== null) {
                        addCustomPlace(item.customDTO)
                        .then(res2 => {
                                const subItem = {plMainSeq: res.data, nday: item.nDay, code : item.code,
                                startTime : item.startTime, endTime : item.endTime, context : item.context,
                                placeSw: 1, plCustomSeq : res2.data}
                                addSubItem(subItem)
                                .then(res3 => console.log(res3))
                                .catch(e => console.log(e))
                            }
                        )
                        .catch(e => console.log(e))
                    }
            })
            togoDTO.map(togo => {
                const toStartDate = new Date(startDate);
                toStartDate.setDate(toStartDate.getDate() + subDTO.filter(item => item.toNum === togo.seq)
                .slice().sort((a, b) => a.nDay - b.nDay)[0].nDay - 1);

                const toEndDate = new Date(startDate);
                toEndDate.setDate(toEndDate.getDate() + 
                subDTO.filter(item => item.toNum === togo.seq).slice().sort((a, b) => a.nDay - b.nDay)
                [subDTO.filter(item => item.toNum === togo.seq).length-1].nDay - 1);

                const togoItem = {tnum : togo.tNum,title : togo.title,context : togo.context, startDate: toStartDate,
                                endDate: toEndDate}
                addTogether(togoItem)
                .then(tores => 
                    subDTO.filter(item2 => item2.toNum === togo.seq).map(item => {
                        if(item.place !== null) {
                            const subItem = {plMainSeq: res.data, nday: item.nDay, code : 2,
                            startTime : item.startTime, endTime : item.endTime, context : item.context,
                            placeSw: 0, placeSeq: item.place.placeSeq,toMainSeq: tores.data}
                            addSubItem(subItem)
                            .then(res2 => console.log(res2))
                            .catch(e => console.log(e))
                        }
                        if(item.customDTO !== null) {
                                addCustomPlace(item.customDTO)
                                .then(res2 => {
                                        const subItem = {plMainSeq: res.data, nday: item.nDay, code : 2,
                                        startTime : item.startTime, endTime : item.endTime, context : item.context,
                                        placeSw: 1, plCustomSeq : res2.data,toMainSeq: tores.data}
                                        addSubItem(subItem)
                                    }
                                )
                                .catch(e => console.log(e))
                            }
                    })
                )
                .catch(e => console.error(e) )
            })
            textDTO.map(item => {
                const plannerText = {plMainSeq: res.data, id : item.id, nday: item.nDay,
                    orders : item.order, context : item.context}
                    addPlannerText(plannerText)
                    .then(res2 => console.log(res2))
                    .catch(e => console.log(e))
            })
            ////blobURL처리한 이미지 업로드 매커니즘
            imageDTO.map(item => {
                const formData = new FormData();
                const images = item.image.split(',')
                Promise.all(images.map((item2, index2) => {
                    return fetch(item2)
                    .then(response => response.blob())
                    .then(blob => {
                        const file = new File([blob], `image_${index2}.png`, { type: 'image/png' });
                        formData.append(`files`, file);
                    });
                }))
                .then(() => {
                    uploadPlannerImage(formData)
                    .then(res2 => {
                        const plannerImage = {plMainSeq: res.data, nday: item.nDay, image : res2.data} 
                        addPlannerImage(plannerImage)
                        .then(res3 => console.log(res3))
                        .catch(e => console.log(e))
                    })
                    .catch(e => console.log(e))
                })
            })
            ////
            alert('등록 완료')
            navigate(`/community`)
        })
        .catch(e => console.log(e))
    }
    //이미지 업로드
    const [imageDTO, setImageDTO] = useState([]);

    const onImage = (e,nDay) => {
        const files = e.target.files;        
        let image = ''
        if(files.length > 5) alert('5개 이하로 선택해')
        else {
            if(imageDTO.findIndex(item => item.nDay === nDay) === -1) {//이미지 파일 올린적 없을때
                for (let i = 0; i < files.length; i++) {
                    image += URL.createObjectURL(files[i]);
                    if(i !== files.length-1) image += ',';
                }
                const selectedImages = {nDay: nDay, image: image};
                setImageDTO([...imageDTO,selectedImages]);
            } else {//이미지 파일 올린적 있을때
                for (let i = 0; i < files.length; i++) {
                    image += URL.createObjectURL(files[i]);
                    if(i !== files.length-1) image += ',';
                }
                const selectedImages = imageDTO.filter(item => item.nDay !== nDay)
                selectedImages.push({nDay: nDay, image: image})
                setImageDTO(selectedImages);
            }
        }
    };
    
    const deleteImg = (nDay,index) => {
        const uid = imageDTO.filter(item => item.nDay !== nDay)
        const images = imageDTO.find(item => item.nDay === nDay).image.split(',')
        images.splice(index,1)
        if(images.length > 0) uid.push({nDay: nDay, image: images.join(',')});

        setImageDTO(uid);
    }
/////////////////////////////////////////////////////////
    useEffect(() => {
        const utd = textDTO
        const usd = subDTO
        const sDay = new Date(startDate);
        const eDay = new Date(endDate);
        if(eDay < sDay) setEndDay(startDate)
        const ar = [];
        for(let i = 0;i <= (eDay - sDay)/(1000 * 60 * 60 * 24);i++) {
            ar.push(i+1)
            if (utd.filter(nd=> nd.nDay === (i+1)).findIndex(item => item.order === 0) === -1){
                utd.push({
                    id : (i+1)+'n'+0,
                    nDay : (i+1),
                    order : 0,
                    context:'',
                    height: 23
                });
            }
        }
        setTextDTO(utd.filter(item => item.nDay <= ar[ar.length-1]).slice().sort((a, b) => a.id - b.id))
        setSubDTO(usd.filter(item => item.nDay <= ar[ar.length-1]))
        setDDay(ar)
    },[startDate,endDate])

    const onStartDay = (e) => {
        const oldsDay = new Date(startDate)
        const newsDay = new Date(e.target.value)
        const sub = (oldsDay - newsDay)/(1000 * 60 * 60 * 24)
        if(sub > 0) {
            setTextDTO(item => {
                const utd = item.map(item2 => 
                    item2 !== null  && { ...item2, id : ((item2.nDay+sub)+'n'+item2.id.split('n')[1]),
                    nDay : (item2.nDay+sub) }
                );
                return utd;
            });
            setSubDTO(item => {
                const utd = item.map(item2 => 
                    item2 !== null  && { ...item2, nDay : (item2.nDay+sub) }
                );
                return utd;
            });
            setImageDTO(item => {
                const utd = item.map(item2 => 
                    item2 !== null  && { ...item2, nDay : (item2.nDay+sub) }
                );
                return utd;
            });
            setTabNum(1)
        }
        if(sub < 0) {
            setTextDTO(item => {
                const utd = item.filter(item2 => item2.nDay > -sub).map(item3 => 
                    item3 !== null  && { ...item3, id : ((item3.nDay+sub)+'n'+item3.id.split('n')[1]),
                    nDay : (item3.nDay+sub) }
                );
                return utd;
            });
            setSubDTO(item => {
                const utd = item.filter(item2 => item2.nDay > -sub).map(item3 => 
                    item3 !== null  && { ...item3, nDay : (item3.nDay+sub) }
                );
                return utd;
            });
            setImageDTO(item => {
                const utd = item.filter(item2 => item2.nDay > -sub).map(item3 => 
                    item3 !== null  && { ...item3, nDay : (item3.nDay+sub) }
                );
                return utd;
            });
            setTabNum(1)
        }
        //양수로 나오면 그 양수 만큼 기존 값들 nDay값 늘리기 음수로 나오면 음수만큼 기존에 값들 걸러서 삭제 같으면 무반응
        setStartDay(e.target.value)
        const ed = document.getElementById('endDate')
        ed.focus()
    }

    const onTab = (num) => {
        setTabNum(num);
    } 
    const onTo = (num) => {
        setToNum(num);
    } 
    const addTo = () => {
        setToNum(++toSeq.current)
        setTogoDTO([...togoDTO,{
            seq: toSeq.current,//임시 seq
            title: '',
            tNum: 2,
            context: '',
        }])
    }
//동행 동작함수******************************
    const onToTitle = (e, seq) => {
        setTogoDTO(item => {
            const utd = item.map(item2 => 
                item2.seq === seq ? { ...item2, title: e.target.value } : item2
            );
            return utd;
        });
    };
    const onToContext = (e,seq) => {
        setTogoDTO(item => {
            const utd = item.map(item2 => 
                item2.seq === seq ? { ...item2, context: e.target.value } : item2
            );
            return utd;
        });
    }
    const onToTNum = (e,seq) => {
        if(e.target.value <= 10 && e.target.value >= 2) {
            setTogoDTO(item => {
                const utd = item.map(item2 => 
                    item2.seq === seq ? { ...item2, tNum: e.target.value } : item2
                );
                return utd;
            });
        }
    }
    const onToDelete = (seq) => {
        onTo(0)
        setTogoDTO(item => {
            const utd = item.filter(item2 => item2.seq !== seq)
            return utd;
        });
        setSubDTO(item => {
            return item.map(item2 => {
            if (item2.toNum === seq) {
                return { ...item2, toNum: undefined };
            } else {
                return item2;
            }
            });
        });
    }
    const toItemDelete = (nDay,endTime) => {
        setSubDTO(item => {
            return item.map(item2 => {
            if (item2.nDay === nDay && item2.endTime === endTime) {
                return { ...item2, toNum: undefined };
            } else {
                return item2;
            }
            });
        });
    } 
//******************************************
    useEffect(() => {//tab키 이동시
        getCityList()
        .then(res => {
            setCity(res.data)
        })
        .catch(e => console.log(e))
        const handleTabPress = (e) => {
          if (e.key === 'Tab') {
            e.preventDefault() 
          }
        };
        document.addEventListener('keydown', handleTabPress);
        return () => {
            document.removeEventListener('keydown', handleTabPress);
        };
      }, []);

    return (
        <div>
            <section className={styles.mainSection}>
            <button onClick={() =>alert(JSON.stringify(dDay))}>nDay 확인</button>
            <button onClick={() =>alert(JSON.stringify(subDTO))}>sub json 확인</button>
            <button onClick={() =>alert(JSON.stringify(textDTO))}>text json확인</button>
            <button onClick={() =>alert(JSON.stringify(togoDTO))}>동행 json 확인</button>
            <button onClick={() =>alert(JSON.stringify(imageDTO))}>image json 확인</button>
            <section className={styles.topSection}>
            {/* 제목 */}
            <div className={styles.plannerTitle}>{/* 세션 유저이름*/}인호의 {plannerTitle.length > 0 && 
            city.find(item => item.citySeq === plannerTitle[0]).cityName}
            {plannerTitle.length > 1 && ' 외 ' + (plannerTitle.length-1) + '곳 '}여행 플래너</div> 
            {/* 달력 */}
            <div className={styles.calender}>
            <div className={styles.inCalender}>
                <input type='date' min={nowDay} value={startDate} onChange={onStartDay} />
                <input type='date' min={startDate} value={endDate} onChange={(e) => setEndDay(e.target.value)} id='endDate'/>
            </div>
            <h1 style={{clear:'both'}}></h1>
            <p>{new Date(startDate).getMonth()+1}월 {new Date(startDate).getDate()}일&nbsp;&nbsp;|&nbsp;&nbsp; 
            {new Date(endDate).getMonth()+1}월 {new Date(endDate).getDate()}일</p></div>
            <div style={{clear:'both'}}></div>
            {toList === 0 ? <button className={styles.buttons} style={{float:'right'}} onClick={togoDTO.length < 8 ? () => addTo() : () => 
            alert('생성 가능 개수를 초과하였습니다')}>동행 추가</button> : <button style={{float:'right'}} className={styles.buttons}
            onClick={()=>onToList(0)}>동행 목록</button>}
            <div style={{clear:'both'}}></div>
            {/* 공개 비공개 토글 */}
            <div style={{float:'left'}}>공개 여부&nbsp;&nbsp;</div><div className={styles.publicBut} onClick={()=>setPublicPlan(!publicPaln)} 
            style={{paddingLeft: publicPaln ? '20px' : '2px' ,backgroundColor: publicPaln ? 'darkgray' : 'whitesmoke'}}>
            <div></div></div>
            <div style={{clear:'both'}}></div>
            </section>
                {/* 동행 섹션 */}
                <section className={styles.togoOutSection} style={{height: togoDTO.length === 0 && 0}}>
                    <section className={styles.togoSection}>
                        {/* 동행 아이템 일정 리스트 섹션 */}
                        <section className={styles.togoScrollSec} style={{height:toList === 0 ? '0px' : '100%'}}>
                            <TogoItemList toList={toList} subDTO={subDTO} sDay={startDate} toItemDelete={toItemDelete} xBut={xBut}/>
                        </section>
                        {/* 동행 아이템 섹션 */}
                        <section className={styles.togoScrollSec} style={{height:toList !== 0 ? '0px' : '100%'}}>
                        {
                            togoDTO.map((item,index) => <Togother key={item.seq} num={item.seq} togoDTO={togoDTO} toNum={toNum}
                            onTo={onTo} subDTO={subDTO} onToTitle={onToTitle} onToContext={onToContext} onToTNum={onToTNum}
                            onToDelete={onToDelete} onToList={onToList} toList={toList} sDay={startDate} xBut={xBut} index={index}/>)
                        }
                        </section>
                    </section>
                </section>
                {/* 플래너 섹션 */}
                <section className={styles.nDayOutSection}>
                    <section className={styles.nDaySection}>
                    <div className={styles.space}></div>{/* 빈공간 만들기용 */}
                        {
                            dDay.map((item, index) => (
                                <div key={index}>
                                <Nday nDay={item} tabNum={tabNum} onTab={onTab} subDTO={subDTO} toNum={toNum}
                                setSubDTO={setSubDTO} textDTO={textDTO} setTextDTO={setTextDTO} sDay={startDate}
                                imageDTO={imageDTO} onImage={onImage} deleteImg={deleteImg}  xBut={xBut}
                                GoogleMap={GoogleMap} Autocomplete={Autocomplete} />
                                {dDay.length !== 0 && index !== dDay.length - 1 && (
                                    <div className={styles.nDayDiv}><img  src={arrow}/></div>)}
                                </div>
                            ))
                        }
                    <div className={styles.space}></div>{/* 빈공간 만들기용 */}
                    </section>
                </section>
                <div style={{clear:'both'}}></div>
                <section className={styles.bottomSection}>
                    <button className={styles.buttons} style={{float:'right',margin:'30px 10px'}} onClick={()=>uploadPlanner()}>저장</button>
                </section>
            </section>
        </div>
    );
};

export default Form;

//플래너 메인 데이터 먼저 insert
//거기서 then으로 시퀀스 값을 빼와서 아이템 요소들 순차적으로 insert
//따로 seq를 변수를 리액트에 만들어서 순서대로 들어가게