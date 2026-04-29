import React from 'react'
import { Box, H2, H5, Text, Illustration } from '@adminjs/design-system'

const Dashboard = (props) => {
  const { summary } = props.data

  return (
    <Box variant="grey">
      <Box variant="white" padding="xl" marginY="xl">
        <H2>Welcome to E-commerce Admin</H2>
        <Text>Overview of your store's performance</Text>
      </Box>

      <Box display="flex" flexDirection="row" flexWrap="wrap">
        <Box width={[1, 1/2, 1/4]} padding="md">
          <Box variant="white" padding="lg" textAlign="center">
            <H5>Total Users</H5>
            <H2>{summary?.totalUsers || 0}</H2>
          </Box>
        </Box>
        <Box width={[1, 1/2, 1/4]} padding="md">
          <Box variant="white" padding="lg" textAlign="center">
            <H5>Total Products</H5>
            <H2>{summary?.totalProducts || 0}</H2>
          </Box>
        </Box>
        <Box width={[1, 1/2, 1/4]} padding="md">
          <Box variant="white" padding="lg" textAlign="center">
            <H5>Total Orders</H5>
            <H2>{summary?.totalOrders || 0}</H2>
          </Box>
        </Box>
        <Box width={[1, 1/2, 1/4]} padding="md">
          <Box variant="white" padding="lg" textAlign="center" border="primary">
            <H5>Total Revenue</H5>
            <H2>LKR {summary?.totalRevenue || '0.00'}</H2>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Dashboard
