import React from 'react';
import { shallow } from 'enzyme';
import VendorInvestmentOffer from './VendorInvestmentOffer';

describe('<VendorInvestmentOffer />', () => {
  test('renders', () => {
    const wrapper = shallow(<VendorInvestmentOffer />);
    expect(wrapper).toMatchSnapshot();
  });
});
