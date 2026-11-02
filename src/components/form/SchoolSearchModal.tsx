'use client';

import styled from '@emotion/styled';
import { useState } from 'react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Modal from '@/components/common/Modal';
import type { School } from '@/services/form/api';
import { useSchoolsQuery } from '@/services/form/queries';
import color from '@/styles/color';
import font from '@/styles/font';

interface SchoolSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (school: School) => void;
}

const SchoolSearchModal = ({ isOpen, onClose, onSelect }: SchoolSearchModalProps) => {
  const [input, setInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [recentKeywords, setRecentKeywords] = useState<string[]>([]);
  const [selectedCode, setSelectedCode] = useState('');
  const { data: schools, isFetching } = useSchoolsQuery(keyword);

  const confirm = () => {
    const school = schools?.find(({ code }) => code === selectedCode);
    if (!school) return;
    onSelect(school);
    onClose();
  };

  const search = (value = input) => {
    const query = value.trim();
    if (!query) return;
    setKeyword(query);
    setRecentKeywords((prev) => [query, ...prev].slice(0, 5));
  };

  return (
    <Modal isOpen={isOpen} title="출신학교 검색" onClose={onClose} width="560px">
      <SearchRow>
        <Input
          placeholder="학교 이름을 입력해주세요 (예: 해운대)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') search();
          }}
        />
        <Button onClick={() => search()}>검색</Button>
      </SearchRow>
      {recentKeywords.length > 0 && (
        <Recent>
          <span>최근 검색어</span>
          {recentKeywords.map((recent, index) => (
            <Chip
              key={`${recent}-${index}`}
              onClick={() => {
                setInput(recent);
                search(recent);
              }}
            >
              {recent}
            </Chip>
          ))}
        </Recent>
      )}
      <List>
        {isFetching && <Empty>검색 중...</Empty>}
        {!isFetching && keyword && schools?.length === 0 && <Empty>검색 결과가 없습니다.</Empty>}
        {!isFetching &&
          schools?.map((school) => (
            <Item
              key={school.code}
              selected={school.code === selectedCode}
              onClick={() => setSelectedCode(school.code)}
              onDoubleClick={confirm}
            >
              <strong>{school.name}</strong>
              <span>{school.region}</span>
            </Item>
          ))}
      </List>
      <Button width="100%" disabled={!selectedCode} onClick={confirm}>
        선택 완료
      </Button>
    </Modal>
  );
};

export default SchoolSearchModal;

const SearchRow = styled.div`
  display: flex;
  gap: 8px;
`;

const Recent = styled.div`
  ${font.caption};
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  color: ${color.gray600};
`;

const Chip = styled.button`
  ${font.caption};
  padding: 4px 10px;
  border-radius: 999px;
  color: ${color.gray700};
  background-color: ${color.gray100};
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  min-height: 200px;
  list-style: none;
`;

const Item = styled.li<{ selected: boolean }>`
  ${font.p3};
  display: flex;
  justify-content: space-between;
  padding: 14px 8px;
  border-bottom: 1px solid ${color.gray200};
  cursor: pointer;
  background-color: ${({ selected }) => (selected ? color.maruLightBlue : 'transparent')};

  span {
    color: ${color.gray600};
  }

  &:hover {
    background-color: ${({ selected }) => (selected ? color.maruLightBlue : color.gray100)};
  }
`;

const Empty = styled.li`
  ${font.p3};
  padding: 40px 0;
  color: ${color.gray500};
  text-align: center;
`;
