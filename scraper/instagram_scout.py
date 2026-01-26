# Instagram 인플루언서 스크래퍼 (Gong-gu Scout AI)
# 주의: Instagram 비공식 API 사용 - 테스트용 부계정만 사용하세요!

import time
import random
import re
import pandas as pd
import logging
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Optional

from instagrapi import Client
from instagrapi.exceptions import (
    ChallengeRequired,
    FeedbackRequired,
    LoginRequired,
    PleaseWaitFewMinutes
)

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('scraper.log', encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


class InstagramInfluencerScout:
    """공구 전문 인플루언서 발굴을 위한 Instagram 스크래퍼"""
    
    # 공구 관련 키워드 (확장 가능)
    GONGGU_KEYWORDS = [
        '공구', '공동구매', '구매링크', '오픈', 'market',
        '판매', '할인', '특가', '주문', '링크'
    ]
    
    def __init__(self, username: str, password: str):
        """
        초기화
        
        Args:
            username: Instagram 사용자명 (테스트용 부계정 권장)
            password: 비밀번호
        """
        self.client = Client()
        self.username = username
        self.password = password
        self.session_file = Path('session.json')
        
    def login(self) -> bool:
        """
        세션 관리를 통한 안전한 로그인
        
        Returns:
            bool: 로그인 성공 여부
        """
        try:
            # 기존 세션 파일이 있으면 로드 (재로그인 방지)
            if self.session_file.exists():
                logger.info("기존 세션 파일 발견. 세션 로드 중...")
                self.client.load_settings(self.session_file)
                self.client.login(self.username, self.password)
                
                # 세션 검증
                try:
                    self.client.get_timeline_feed()
                    logger.info("세션 검증 성공!")
                    return True
                except LoginRequired:
                    logger.warning("세션 만료됨. 재로그인 필요.")
                    self.session_file.unlink()  # 만료된 세션 삭제
            
            # 신규 로그인
            logger.info(f"'{self.username}' 계정으로 로그인 중...")
            self.client.login(self.username, self.password)
            
            # 세션 저장
            self.client.dump_settings(self.session_file)
            logger.info("로그인 성공! 세션 파일 저장 완료.")
            return True
            
        except ChallengeRequired as e:
            logger.error("⚠️ Challenge Required: 2단계 인증 또는 보안 검증 필요")
            logger.error("해결 방법: 휴대폰으로 Instagram 앱 로그인 → 보안 확인 완료")
            return False
            
        except FeedbackRequired as e:
            logger.error("⚠️ Feedback Required: 과도한 요청 감지")
            logger.error("해결 방법: 24시간 대기 후 재시도")
            return False
            
        except Exception as e:
            logger.error(f"로그인 실패: {e}")
            return False
    
    def safe_sleep(self, min_seconds: float = 2.0, max_seconds: float = 5.0):
        """사람처럼 행동하기 위한 랜덤 대기"""
        delay = random.uniform(min_seconds, max_seconds)
        time.sleep(delay)
    
    def extract_email(self, text: str) -> Optional[str]:
        """
        텍스트에서 이메일 추출
        
        Args:
            text: 검색할 텍스트 (bio, caption 등)
            
        Returns:
            str | None: 추출된 이메일 주소
        """
        if not text:
            return None
        
        email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
        match = re.search(email_pattern, text)
        return match.group(0) if match else None
    
    def check_gonggu_activity(self, user_id: str, post_limit: int = 3) -> bool:
        """
        최근 게시물에서 공구 활동 확인
        
        Args:
            user_id: Instagram 사용자 ID
            post_limit: 확인할 최근 게시물 수
            
        Returns:
            bool: 공구 활동이 감지되면 True
        """
        try:
            # 최근 게시물 가져오기
            medias = self.client.user_medias(user_id, amount=post_limit)
            
            for media in medias:
                caption = media.caption_text.lower() if media.caption_text else ""
                
                # 공구 키워드 검색
                for keyword in self.GONGGU_KEYWORDS:
                    if keyword in caption:
                        logger.debug(f"공구 키워드 발견: '{keyword}' in post {media.pk}")
                        return True
            
            return False
            
        except Exception as e:
            logger.warning(f"공구 활동 확인 실패 (user_id: {user_id}): {e}")
            return False
    
    def discover_influencers(
        self,
        hashtag: str,
        min_followers: int = 10000,
        max_followers: int = 100000,
        max_results: int = 50
    ) -> List[Dict]:
        """
        해시태그 기반 인플루언서 발굴
        
        Args:
            hashtag: 검색할 해시태그 (예: '육아공구')
            min_followers: 최소 팔로워 수
            max_followers: 최대 팔로워 수
            max_results: 최대 수집 인플루언서 수
            
        Returns:
            List[Dict]: 필터링된 인플루언서 정보 리스트
        """
        logger.info(f"🔍 해시태그 '{hashtag}' 검색 시작...")
        
        try:
            # 1. 해시태그에서 게시물 수집 (Top + Recent)
            medias_top = self.client.hashtag_medias_top(hashtag, amount=27)
            self.safe_sleep(2, 4)
            
            medias_recent = self.client.hashtag_medias_recent(hashtag, amount=50)
            self.safe_sleep(2, 4)
            
            all_medias = medias_top + medias_recent
            logger.info(f"수집된 게시물 수: {len(all_medias)}")
            
            # 2. 고유 사용자 ID 추출
            unique_users = set()
            for media in all_medias:
                unique_users.add(media.user.pk)
            
            logger.info(f"고유 사용자 수: {len(unique_users)}")
            
            # 3. 사용자 정보 수집 및 필터링
            qualified_influencers = []
            
            for idx, user_id in enumerate(unique_users, 1):
                if len(qualified_influencers) >= max_results:
                    logger.info(f"목표 달성: {max_results}명 수집 완료")
                    break
                
                try:
                    # 사용자 상세 정보 가져오기
                    user_info = self.client.user_info(user_id)
                    
                    # 팔로워 수 필터링
                    follower_count = user_info.follower_count
                    if not (min_followers <= follower_count <= max_followers):
                        logger.debug(f"Skip: {user_info.username} (팔로워: {follower_count:,})")
                        self.safe_sleep(1, 2)
                        continue
                    
                    # 이메일 추출
                    email = (
                        user_info.public_email or
                        self.extract_email(user_info.biography) or
                        None
                    )
                    
                    # 공구 활동 확인
                    is_active_seller = self.check_gonggu_activity(user_id)
                    
                    # 참여율 계산 (간단 버전: media_count 기반)
                    engagement_rate = round(
                        (user_info.media_count / follower_count * 100), 2
                    ) if follower_count > 0 else 0.0
                    
                    # 데이터 저장
                    influencer = {
                        'username': user_info.username,
                        'full_name': user_info.full_name,
                        'followers': follower_count,
                        'following': user_info.following_count,
                        'media_count': user_info.media_count,
                        'engagement_rate': engagement_rate,
                        'email': email,
                        'is_active_seller': is_active_seller,
                        'is_business': user_info.is_business,
                        'category': user_info.category_name if hasattr(user_info, 'category_name') else None,
                        'bio': user_info.biography[:100] if user_info.biography else None,  # 100자 제한
                        'profile_link': f"https://instagram.com/{user_info.username}",
                        'collected_at': datetime.now().isoformat()
                    }
                    
                    qualified_influencers.append(influencer)
                    logger.info(
                        f"[{len(qualified_influencers)}/{max_results}] ✅ "
                        f"{user_info.username} | "
                        f"팔로워: {follower_count:,} | "
                        f"공구활동: {'🔴 활발' if is_active_seller else '⚪ 없음'}"
                    )
                    
                    # Anti-Ban: 사람처럼 행동
                    self.safe_sleep(3, 6)
                    
                except PleaseWaitFewMinutes:
                    logger.warning("⚠️ Rate Limit 도달. 10분 대기...")
                    time.sleep(600)  # 10분 대기
                    
                except Exception as e:
                    logger.error(f"사용자 정보 수집 실패 (ID: {user_id}): {e}")
                    self.safe_sleep(2, 4)
                    continue
            
            logger.info(f"🎉 최종 수집 완료: {len(qualified_influencers)}명")
            return qualified_influencers
            
        except Exception as e:
            logger.error(f"인플루언서 발굴 실패: {e}")
            return []
    
    def save_to_csv(self, influencers: List[Dict], filename: str = None):
        """
        수집한 데이터를 CSV로 저장
        
        Args:
            influencers: 인플루언서 정보 리스트
            filename: 저장할 파일명 (기본값: 타임스탬프 포함)
        """
        if not influencers:
            logger.warning("저장할 데이터가 없습니다.")
            return
        
        if filename is None:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f'influencers_{timestamp}.csv'
        
        df = pd.DataFrame(influencers)
        df.to_csv(filename, index=False, encoding='utf-8-sig')  # Excel 호환
        logger.info(f"💾 CSV 저장 완료: {filename}")
        
        # 통계 출력
        logger.info("\n📊 수집 통계:")
        logger.info(f"  - 총 인플루언서: {len(influencers)}명")
        logger.info(f"  - 공구 활동 중: {sum(1 for x in influencers if x['is_active_seller'])}명")
        logger.info(f"  - 이메일 보유: {sum(1 for x in influencers if x['email'])}명")
        logger.info(f"  - 비즈니스 계정: {sum(1 for x in influencers if x['is_business'])}명")


# =============================================================================
# 실행 예제
# =============================================================================
def main():
    """메인 실행 함수"""
    
    # ⚠️ 경고: config.py에서 부계정 정보 불러오기 (아래 참조)
    from config import INSTAGRAM_USERNAME, INSTAGRAM_PASSWORD
    
    # 스크래퍼 초기화
    scout = InstagramInfluencerScout(
        username=INSTAGRAM_USERNAME,
        password=INSTAGRAM_PASSWORD
    )
    
    # 로그인
    if not scout.login():
        logger.error("로그인 실패. 프로그램 종료.")
        return
    
    # 인플루언서 발굴
    influencers = scout.discover_influencers(
        hashtag='육아공구',          # 검색할 해시태그
        min_followers=10000,        # 최소 1만 팔로워
        max_followers=100000,       # 최대 10만 팔로워 (마이크로 인플루언서)
        max_results=30              # 최대 30명 수집
    )
    
    # CSV 저장
    if influencers:
        scout.save_to_csv(influencers)
    else:
        logger.warning("수집된 인플루언서가 없습니다.")


if __name__ == '__main__':
    main()
