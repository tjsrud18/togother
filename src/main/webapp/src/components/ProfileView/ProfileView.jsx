import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import thumb from 'D:/SpringBoot/workspace/togOther/src/main/webapp/src/assets/image/profile_thumb.png';
import { getUserByUserSeq } from '../../api/ProfileApiService';

function ProfileView({ show, onHide, userSeq }) {
  const [user, setUser] = useState();
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserByUserSeq(userSeq);
        setUser(userData);
      } catch (error) {
        console.error('사용자 데이터를 가져오는 중 오류 발생:', error);
      }
    };

    if (userSeq) {
      fetchData();
    }
  }, [userSeq]);

  // user가 null 또는 undefined인 경우를 처리하는 조건부 렌더링
  if (!user) {
    return null; // 또는 로딩 상태를 처리할 수 있는 JSX를 반환하세요.
  }

  const birthday = new Date(user.data.birthday);
  const today = new Date();
  let age = today.getFullYear() - birthday.getFullYear();

  if (
    today.getMonth() < birthday.getMonth() ||
    (today.getMonth() === birthday.getMonth() && today.getDate() < birthday.getDate())
  ) {
    age--;
  }

  const ageGroup = Math.floor(age / 10) * 10;
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        {/* <Modal.Title id="contained-modal-title-vcenter">
          Modal heading
        </Modal.Title> */}
      </Modal.Header>
      <Modal.Body>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>    
            <img
                src={user.data.profileImage || thumb}
                roundedCircle
                style={{ width: '150px', height: '150px', marginRight: '20px' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '3em', marginBottom: '5px' }}>
                   {user.data.name}
                </span>
                <span style={{ fontSize: '1.4em', marginBottom: '5px' }}>나이 : {ageGroup}대</span>
                <span style={{ fontSize: '1.4em', marginBottom: '5px' }}>
                    성별 : {user.data.gender === 'M' ? '남성' : user.data.gender === 'F' ? '여성' : '알 수 없음'}
                </span>
                <span style={{ fontSize: '1.4em', marginBottom: '5px' }}>MBTI : {user.data.mbti ? user.data.mbti : 'MBTI가 존재하지 않습니다'}</span>
            </div>
        </div>
        <div style={{ fontSize: '1.4em', marginTop: '30px' }}>
            {user.data.profileText}
        </div>
        <hr></hr>
        <div style={{ fontSize: '1.3em', marginTop: '25px' }}>
            #{user.data.likingTrip ? user.data.likingTrip.replace(/,/g, ' #') : ''} #{user.data.likingFood ? user.data.likingFood.replace(/,/g, ' #') : ''}
        </div>


      </Modal.Body>
      
    </Modal>
  );
}

export default ProfileView;