import React from 'react';
import styles from '../../css/MyPage.module.css';
import { useUserStore } from '../../stores/mainStore';


const MypageWrite = () => {

    const { user, getUserByToken } = useUserStore();

    console.log(user);

    return (
        <div>
            <p>여기가 계정 정보</p>
                <div className={ styles.writeForm }>
                    <div className={ styles.photo_mbti }>
                        <div className={ styles.photo }>
                            <img src={ user.profileImage} style={{ width: '95px', height : '95px' }} />
                        </div>
                        <div className={ styles.mbti }>
                            {
                                user.mbti === '' || user.mbti === null ? <span>MBTI가 없습니다.</span> : <span>{user.mbti}</span>
                            }
                            

                            <button className={ styles.nameInput } style={{fontSize: '30px', width : '230px', height : '45px', textAlign: 'center' }} >{user.name}</button>
                        </div> {/* styles.mbti */}
                    </div>

                <div className={ styles.textdiv }>
                    <div>
                        <div>
                            <h3 style={{ marginTop: '80px', textAlign: 'left', marginLeft: '90px' }}>소개글</h3>
                                <textarea className={ styles.text1 } placeholder='소개글을 입력해주세요. (2000자 이내)' value={user.profileText} maxLength={ '2000' }></textarea>
                        </div>

                        <div>
                            <h3 style={{ marginTop: '30px', textAlign: 'left', marginLeft: '90px' }}>sns 연동</h3>
                                <input type='text' readonly placeholder='@를 제외한 userID만 입력' className={ styles.text1 } maxLength={ '40' }></input>
                        </div>

                        <div>
                            <h3 style={{ marginTop: '30px', textAlign: 'left', marginLeft: '90px'}}>회원 정보</h3>
                                <div className={ styles.inputdiv }>
                                    <div><p style={{ marginTop: '3.5px' }}>태어난 연도</p><input type='text'></input></div>
                                    <div><p style={{ marginTop: '3.5px' }}>월</p><input type='text'></input></div>
                                    <div><p style={{ marginTop: '3.5px' }}>일</p><input type='text'></input></div>
                                    <div><p style={{ marginTop: '3.5px' }}>성별</p><input type='text'></input></div>
                                </div>
                        </div>
                        
                        <div className={ styles.change }>
                            <ul>
                                <li>
                                    <button>비밀번호 변경</button>
                                    <button>휴대폰번호 변경</button>
                                    <button>여행취향 변경</button>
                                    <button>음식취향 변경</button>
                                    <button>mbti 테스트</button>
                                    <button>회원탈퇴</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div> {/* textdiv */}
            </div>
        </div>
    );
};

export default MypageWrite;