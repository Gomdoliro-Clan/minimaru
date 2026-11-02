'use client';

import styled from '@emotion/styled';
import { useAtomValue } from 'jotai';
import { formAtom } from '@/stores';
import color from '@/styles/color';
import font from '@/styles/font';
import { formatBirthday } from '@/utils/form';
import GradePreview from '../GradePreview';
import { Description, StepSection, StepTitle } from '../styles';

const GRADUATION_LABEL = {
  EXPECTED: '졸업 예정',
  GRADUATED: '졸업',
  QUALIFICATION_EXAMINATION: '검정고시',
  '': '-',
};

const TYPE_LABEL = {
  REGULAR: '일반전형',
  SPECIAL: '특별전형',
  MEISTER_TALENT: '마이스터인재전형',
  SOCIAL_INTEGRATION: '사회통합전형',
  '': '',
};

const ConfirmStep = () => {
  const form = useAtomValue(formAtom);
  const { applicant, guardian, education, type, document } = form;

  return (
    <StepSection>
      <StepTitle>최종 확인</StepTitle>
      <Description>제출한 원서는 수정할 수 없습니다. 내용을 꼼꼼히 확인해주세요.</Description>
      <Card>
        {applicant.profileUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <Photo src={applicant.profileUrl} alt="증명사진" />
        )}
        <Table>
          <tbody>
            <tr>
              <th>이름</th>
              <td>{applicant.name}</td>
              <th>생년월일</th>
              <td>{formatBirthday(applicant)}</td>
            </tr>
            <tr>
              <th>성별</th>
              <td>{applicant.gender === 'MALE' ? '남자' : '여자'}</td>
              <th>전화번호</th>
              <td>{applicant.phoneNumber}</td>
            </tr>
            <tr>
              <th>보호자</th>
              <td>
                {guardian.name} ({guardian.relation})
              </td>
              <th>보호자 연락처</th>
              <td>{guardian.phoneNumber}</td>
            </tr>
            <tr>
              <th>주소</th>
              <td colSpan={3}>
                ({guardian.zoneCode}) {guardian.address} {guardian.detailAddress}
              </td>
            </tr>
            <tr>
              <th>출신학교</th>
              <td>{education.schoolName || '-'}</td>
              <th>졸업 구분</th>
              <td>
                {GRADUATION_LABEL[education.graduationType]} ({education.graduationYear})
              </td>
            </tr>
            <tr>
              <th>전형</th>
              <td colSpan={3}>
                {TYPE_LABEL[type.category]} {TYPE_LABEL[type.specialType]}
              </td>
            </tr>
          </tbody>
        </Table>
      </Card>
      <GradePreview form={form} />
      <Document>
        <h3>자기소개서</h3>
        <p>{document.coverLetter}</p>
        <h3>학업계획서</h3>
        <p>{document.studyPlan}</p>
      </Document>
    </StepSection>
  );
};

export default ConfirmStep;

const Card = styled.div`
  display: flex;
  gap: 24px;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const Photo = styled.img`
  width: 120px;
  height: 160px;
  object-fit: cover;
  border-radius: 8px;
`;

const Table = styled.table`
  ${font.p3};
  flex: 1;
  border-collapse: collapse;

  th,
  td {
    padding: 10px 8px;
    border-bottom: 1px solid ${color.gray200};
    text-align: left;
    white-space: nowrap;
  }

  th {
    width: 110px;
    color: ${color.gray600};
    font-weight: 500;
  }
`;

const Document = styled.div`
  ${font.p3};
  display: flex;
  flex-direction: column;
  gap: 8px;

  h3 {
    ${font.H5};
    margin-top: 8px;
  }

  p {
    white-space: pre-wrap;
    color: ${color.gray800};
  }
`;
