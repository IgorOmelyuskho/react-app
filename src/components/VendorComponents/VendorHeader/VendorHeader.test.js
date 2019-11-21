import React from 'react';
import { shallow } from 'enzyme';
import VendorHeader from './VendorHeader';

describe('<VendorHeader />', () => {
  test('renders', () => {
    const wrapper = shallow(<VendorHeader />);
    expect(wrapper).toMatchSnapshot();
  });
});
