import LeaderView from '@/features/retrospects/components/LeaderView';
import { MemberView } from '@/features/retrospects/components/MemberView';

export default function PersonalRetroPage() {
  return (
    <div>
      <LeaderView />
    </div>
  );
}

//// TODO : api Users에 프로젝트 아이디 받아서 사용자 정보 불러오는 거 API 연결 예정할 예정
