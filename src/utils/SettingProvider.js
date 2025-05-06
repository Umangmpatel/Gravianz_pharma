import React, {Component} from 'react';
import {StatusBar, View} from 'react-native';
import {connect} from 'react-redux';
import LoadingDialog from '../components/LoadingDialog';

class SettingsProvider extends Component {
  render() {
    const {rootLoader, rootLoaderTitle} = this.props;
    return (
      <>
        {this.props.children}
        <LoadingDialog isVisible={rootLoader} title={rootLoaderTitle} />
      </>
    );
  }
}

function mapStateToProps({activityIndicator}) {
  return {
    rootLoader: activityIndicator.rootLoader,
    rootLoaderTitle: activityIndicator.rootLoaderTitle,
  };
}

export default connect(mapStateToProps, null)(SettingsProvider);
