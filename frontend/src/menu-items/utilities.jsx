// assets
import {
  AppstoreAddOutlined,
  AntDesignOutlined,
  BarcodeOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  LoadingOutlined,
  ShoppingOutlined,
  StarOutlined,
  CommentOutlined,
  TagOutlined
} from '@ant-design/icons';

// icons
const icons = {
  FontSizeOutlined,
  BgColorsOutlined,
  BarcodeOutlined,
  AntDesignOutlined,
  LoadingOutlined,
  AppstoreAddOutlined,
  ShoppingOutlined,
  StarOutlined,
  CommentOutlined,
  TagOutlined
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
  id: 'utilities',
  title: '',
  type: 'group',
  children: [
    {
      id: 'util-typography',
      title: 'All Products',
      type: 'item',
      url: '/typography',
      icon: icons.ShoppingOutlined // Represents shopping/products
    },
    {
      id: 'util-color',
      title: 'Featured Products',
      type: 'item',
      url: '/color',
      icon: icons.StarOutlined // Represents featured/starred items
    },
    {
      id: 'util-shadow',
      title: 'Testimonials',
      type: 'item',
      url: '/shadow',
      icon: icons.CommentOutlined // Represents feedback/testimonials
    },
    {
      id: 'util-offer',
      title: 'Offers',
      type: 'item',
      url: '/offer',
      icon: icons.TagOutlined // Represents tags/discount offers
    }
  ]
};

export default utilities;
