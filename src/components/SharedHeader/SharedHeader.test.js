import React from 'react';
import { shallow } from 'enzyme';
import SharedHeader from './SharedHeader';

describe('<SharedHeader />', () => {
  test('renders', () => {
    const wrapper = shallow(<SharedHeader />);
    expect(wrapper).toMatchSnapshot();
  });
});
