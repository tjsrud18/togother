package com.finalProject.togOther.advisor;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.finalProject.togOther.domain.City;
import com.finalProject.togOther.domain.Place;
import com.finalProject.togOther.domain.TourPackage;
import com.finalProject.togOther.domain.TourPackageDetail;
import com.finalProject.togOther.domain.User;
import com.finalProject.togOther.dto.CityDTO;
import com.finalProject.togOther.dto.PlaceDTO;
import com.finalProject.togOther.dto.TourPackageDTO;
import com.finalProject.togOther.dto.TourPackageDetailDTO;
import com.finalProject.togOther.dto.UserDTO;
import com.finalProject.togOther.repository.CityRepository;
import com.finalProject.togOther.repository.PlaceRepository;
import com.finalProject.togOther.repository.TourPackageDetailRepository;
import com.finalProject.togOther.repository.TourPackageRepository;
import com.finalProject.togOther.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class AdvisorServiceImpl implements AdvisorService {

	private CityRepository cityRepository;

	private PlaceRepository placeRepository;

	private UserRepository userRepository;
	
	private TourPackageRepository tourPackageRepository;
	
	private TourPackageDetailRepository tourPackageDetailRepository;

	public AdvisorServiceImpl(CityRepository cityRepository, PlaceRepository placeRepository,
			UserRepository userRepository, TourPackageRepository tourPackageRepository,
			TourPackageDetailRepository tourPackageDetailRepository) {
		this.cityRepository = cityRepository;
		this.placeRepository = placeRepository;
		this.userRepository = userRepository;
		this.tourPackageRepository = tourPackageRepository;
		this.tourPackageDetailRepository = tourPackageDetailRepository;
	}

	// 유저 수정 (전체 정보)
	@Override
	public ResponseEntity<UserDTO> updateUser(int userSeq, UserDTO userDTO) {

		try {
			Optional<User> userOptional = userRepository.findById(userSeq);

			userOptional.orElseThrow();

			User updatedUser = userRepository.save(User.toEntity(userDTO));

			return ResponseEntity.ok(UserDTO.toDTO(updatedUser));

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}

	}

	// 유저 삭제 (이메일)
	@Override
	public ResponseEntity<String> deleteUserByEmail(String userEmail) {

		try {
			// 사용자 삭제 서비스 호출
			userRepository.deleteByEmail(userEmail);

			// 사용자가 성공적으로 삭제되었을 때
			String responseMessage = "사용자가 삭제되었습니다.";
			return ResponseEntity.ok(responseMessage);

		} catch (Exception e) {

			// 사용자 삭제 중 에러가 발생했을 때
			String errorMessage = "사용자 삭제 중 오류가 발생했습니다.";
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMessage);
		}
	}

	// 유저 전체 조회
	@Override
	public ResponseEntity<List<UserDTO>> getUser() {

		try {
			List<User> userList = userRepository.findAll();

			List<UserDTO> userDTOList = new ArrayList<UserDTO>();

			for (User user : userList) {

				UserDTO userDTO = UserDTO.toDTO(user);

				userDTOList.add(userDTO);
			}

			return ResponseEntity.ok(userDTOList);

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}

	}

	// 컬럼 유저 조회
	@Override
	public ResponseEntity<List<UserDTO>> getUserByColumn(String column, String value) {

		try {

			List<User> userList = new ArrayList<User>();

			if (column.equals("email")) {
				userList = userRepository.findListByEmail(value);

			} else if (column.equals("name")) {
				userList = userRepository.findListByName(value);
			}

			List<UserDTO> userDTOList = new ArrayList<UserDTO>();

			for (User user : userList) {

				UserDTO userDTO = UserDTO.toDTO(user);

				userDTOList.add(userDTO);
			}

			return ResponseEntity.ok(userDTOList);

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}

	// 유저 조회 아이디
	@Override
	public ResponseEntity<UserDTO> getUserById(String id) {

		try {
			Optional<User> userOptional = userRepository.findById(id);

			User user = userOptional.orElseThrow();

			UserDTO userDTO = UserDTO.toDTO(user);

			return ResponseEntity.ok(userDTO);

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}

	}

	// 도시 추가
	@Override
	public ResponseEntity<String> addCity(CityDTO cityDTO) {

		City city = City.toEntity(cityDTO);

		try {
			cityRepository.save(city);

			String responseMessage = "도시가 추가되었습니다.";

			return ResponseEntity.ok(responseMessage);

		} catch (Exception e) {

			// 도시 추가 중 에러가 발생했을 때
			String errorMessage = "도시 추가 중 오류가 발생했습니다.";
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMessage);
		}

	}

	// 도시 수정 (전체 정보)
	@Override
	public ResponseEntity<CityDTO> updateCity(int citySeq, CityDTO cityDTO) {

		try {

			Optional<City> cityOptional = cityRepository.findById(citySeq);

			cityOptional.orElseThrow();

			City updatedCity = cityRepository.save(City.toEntity(cityDTO));

			return ResponseEntity.ok(CityDTO.toDTO(updatedCity));

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	// 도시 삭제
	@Override
	public ResponseEntity<String> deleteCityBySeq(int seq) {

		try {
			cityRepository.deleteById(seq);

			// 사용자가 성공적으로 삭제되었을 때
			String responseMessage = "도시가 삭제되었습니다.";
			return ResponseEntity.ok(responseMessage);
		} catch (Exception e) {

			// 사용자 삭제 중 에러가 발생했을 때
			String errorMessage = "도시 삭제 중 오류가 발생했습니다.";
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMessage);
		}

	}

	// 도시 전체 조회
	@Override
	public ResponseEntity<List<CityDTO>> getCity() {

		try {
			List<City> cityList = cityRepository.findAll();

			List<CityDTO> cityDTOList = new ArrayList<CityDTO>();

			for (City city : cityList) {

				CityDTO cityDTO = CityDTO.toDTO(city);

				cityDTOList.add(cityDTO);
			}

			return ResponseEntity.ok(cityDTOList);

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}

	// 도시 조회 seq
	@Override
	public ResponseEntity<CityDTO> getCityBySeq(int seq) {

		try {
			Optional<City> cityOptional = cityRepository.findById(seq);

			City city = cityOptional.orElseThrow();

			CityDTO cityDTO = CityDTO.toDTO(city);

			return ResponseEntity.ok(cityDTO);

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}

	}

	// 장소 추가
	@Override
	public ResponseEntity<String> addPlace(PlaceDTO placeDTO) {

		Place place = Place.toEntity(placeDTO);

		try {
			placeRepository.save(place);

			String responseMessage = "장소가 추가되었습니다.";

			return ResponseEntity.ok(responseMessage);

		} catch (Exception e) {

			// 도시 추가 중 에러가 발생했을 때
			String errorMessage = "장소 추가 중 오류가 발생했습니다.";
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMessage);
		}
	}

	// 장소 수정 (전체 정보)
	@Override
	public ResponseEntity<PlaceDTO> updatePlace(int placeSeq, PlaceDTO placeDTO) {

		try {
			Optional<Place> PlaceOptional = placeRepository.findById(placeSeq);

			PlaceOptional.orElseThrow();

			Place updatedPlace = placeRepository.save(Place.toEntity(placeDTO));

			return ResponseEntity.ok(PlaceDTO.toDTO(updatedPlace));

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	// 장소 삭제
	@Override
	public ResponseEntity<String> deletePlaceBySeq(int seq) {

		try {
			placeRepository.deleteById(seq);

			// 사용자가 성공적으로 삭제되었을 때
			String responseMessage = "장소가 삭제되었습니다.";
			return ResponseEntity.ok(responseMessage);
		} catch (Exception e) {

			// 사용자 삭제 중 에러가 발생했을 때
			String errorMessage = "장소 삭제 중 오류가 발생했습니다.";
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMessage);
		}
	}

	// 장소 전체 조회
	@Override
	public ResponseEntity<List<PlaceDTO>> getPlace() {

		try {
			List<Place> placeList = placeRepository.findAll();

			List<PlaceDTO> placeDTOList = new ArrayList<PlaceDTO>();

			for (Place place : placeList) {

				PlaceDTO placeDTO = PlaceDTO.toDTO(place);

				placeDTOList.add(placeDTO);
			}

			return ResponseEntity.ok(placeDTOList);

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}

	// 장소 조회 seq
	@Override
	public ResponseEntity<PlaceDTO> getPlaceBySeq(int seq) {

		try {
			Optional<Place> placeOptional = placeRepository.findById(seq);

			Place place = placeOptional.orElseThrow();

			PlaceDTO placeDTO = PlaceDTO.toDTO(place);

			return ResponseEntity.ok(placeDTO);

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	// 장소 조회 citySeq
	@Override
	public ResponseEntity<List<PlaceDTO>> getPlaceByCitySeq(int citySeq) {

		try {
			List<Place> placeList = placeRepository.findByCitySeq(citySeq);

			List<PlaceDTO> placeDTOList = new ArrayList<PlaceDTO>();

			for (Place place : placeList) {

				PlaceDTO placeDTO = PlaceDTO.toDTO(place);

				placeDTOList.add(placeDTO);
			}

			return ResponseEntity.ok(placeDTOList);

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}

	}

	// 패키지 추가
	@Override
	public ResponseEntity<String> addPackage(TourPackageDTO tourPackageDTO) {

		try {
			TourPackage tourPackage = TourPackage.toEntity(tourPackageDTO);
			tourPackageRepository.save(tourPackage);

			String responseMessage = "패키지가 추가되었습니다.";

			return ResponseEntity.ok(responseMessage);

		} catch (Exception e) {

			// 도시 추가 중 에러가 발생했을 때
			String errorMessage = "장소 추가 중 오류가 발생했습니다.";
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMessage);
		}
	}
	
	// 패키지 수정
	@Override
	public ResponseEntity<TourPackageDTO> updatePackage(int tpSeq, TourPackageDTO tourPackageDTO) {

		try {
			Optional<TourPackage> PackageOptional = tourPackageRepository.findById(tpSeq);

			PackageOptional.orElseThrow();

			TourPackage updatedPackage = tourPackageRepository.save(TourPackage.toEntity(tourPackageDTO));

			return ResponseEntity.ok(TourPackageDTO.toDTO(updatedPackage));

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	// 패키지 삭제
	@Override
	public ResponseEntity<String> deletePackageByTpSeq(int tpSeq) {

		try {
			tourPackageRepository.deleteById(tpSeq);

			// 사용자가 성공적으로 삭제되었을 때
			String responseMessage = "패키지가 삭제되었습니다.";
			return ResponseEntity.ok(responseMessage);
		} catch (Exception e) {

			// 사용자 삭제 중 에러가 발생했을 때
			String errorMessage = "장소 삭제 중 오류가 발생했습니다.";
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMessage);
		}
	}

	// 패키지 전체 조회
	@Override
	public ResponseEntity<List<TourPackageDTO>> getPackage() {
		
		try {
			List<TourPackage> packageList = tourPackageRepository.findAll();

			List<TourPackageDTO> packagaeDTOList = new ArrayList<TourPackageDTO>();

			for (TourPackage tourPackage : packageList) {

				TourPackageDTO tourPackageDTO = TourPackageDTO.toDTO(tourPackage);

				packagaeDTOList.add(tourPackageDTO);
			}

			return ResponseEntity.ok(packagaeDTOList);

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}

	// 패키지 조회 citySeq
	@Override
	public ResponseEntity<List<TourPackageDTO>> getPackageByCitySeq(int citySeq) {
		
		try {
			List<TourPackage> packageList = tourPackageRepository.findByCitySeq(citySeq);

			List<TourPackageDTO> tourPackageDTOList = new ArrayList<TourPackageDTO>();

			for (TourPackage tourPackage : packageList) {

				TourPackageDTO tourPackageDTO = TourPackageDTO.toDTO(tourPackage);

				tourPackageDTOList.add(tourPackageDTO);
			}

			return ResponseEntity.ok(tourPackageDTOList);

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}

	// 상세 패키지 추가
	@Override
	public ResponseEntity<String> addPackageDetail(TourPackageDetailDTO tourPackageDetailDTO) {
		
		try {
			TourPackageDetail tourPackageDetail = TourPackageDetail.toEntity(tourPackageDetailDTO);
			tourPackageDetailRepository.save(tourPackageDetail);

			String responseMessage = "패키지 상세 정보가 추가되었습니다.";

			return ResponseEntity.ok(responseMessage);

		} catch (Exception e) {

			// 도시 추가 중 에러가 발생했을 때
			String errorMessage = "장소 추가 중 오류가 발생했습니다.";
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMessage);
		}
	}

	// 상세 패키지 조회
	@Override
	public ResponseEntity<TourPackageDetailDTO> updatePackageDetail(int tpdSeq,
			TourPackageDetailDTO tourPackageDetailDTO) {
		
		try {
			Optional<TourPackageDetail> PackageDetailOptional = tourPackageDetailRepository.findById(tpdSeq);

			PackageDetailOptional.orElseThrow();

			TourPackageDetail updatedPackageDetail = tourPackageDetailRepository.save(TourPackageDetail.toEntity(tourPackageDetailDTO));

			return ResponseEntity.ok(TourPackageDetailDTO.toDTO(updatedPackageDetail));

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	// 상세 패키지 삭제
	@Override
	public ResponseEntity<String> deletePackageDetailByTpSeq(int tpSeq) {
		
		try {
			tourPackageDetailRepository.deleteById(tpSeq);

			// 사용자가 성공적으로 삭제되었을 때
			String responseMessage = "패키지가 삭제되었습니다.";
			return ResponseEntity.ok(responseMessage);
		} catch (Exception e) {

			// 사용자 삭제 중 에러가 발생했을 때
			String errorMessage = "장소 삭제 중 오류가 발생했습니다.";
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMessage);
		}
	}

	// 상세 패키지 조회 tpSeq
	@Override
	public ResponseEntity<TourPackageDetailDTO> getPackageDetailByTpSeq(int tpSeq) {
		
		try {
			Optional<TourPackageDetail> tourPackageDetailOptional = tourPackageDetailRepository.findByTpSeq(tpSeq);

			TourPackageDetail tourPackageDetail = tourPackageDetailOptional.orElseThrow();

			TourPackageDetailDTO tourPackageDetailDTO = TourPackageDetailDTO.toDTO(tourPackageDetail);

			return ResponseEntity.ok(tourPackageDetailDTO);
			
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}
}
