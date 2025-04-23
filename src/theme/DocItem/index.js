import React from 'react';
import DocItem from '@theme-original/DocItem';
import ProtectedContent from '@site/src/components/ProtectedContent/ProtectedContent';

export default function DocItemWrapper(props) {
  return (
    <ProtectedContent>
      <DocItem {...props} />
    </ProtectedContent>
  );
}