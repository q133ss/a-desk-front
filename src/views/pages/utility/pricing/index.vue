<script>
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";

import { pricingData } from "./data";

/**
 * Pricing component
 */
export default {
  page: {
    title: "Pricing",
    meta: [{ name: "description" }]
  },
  components: { Layout, PageHeader },
  data() {
    return {
      pricingData: pricingData,
      title: "Pricing",
      items: [
        {
          text: "Utility",
          href: "/"
        },
        {
          text: "Pricing",
          active: true
        }
      ]
    };
  }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row justify-content-center">
      <div class="col-lg-5">
        <div class="text-center mb-5">
          <h4>Simple Pricing Plans</h4>
          <p
            class="text-muted mb-4"
          >Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo veritatis</p>

          <ul class="nav nav-pills pricing-nav-tabs">
            <li class="nav-item">
              <a class="nav-link active" href="#">Monthly</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Yearly</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- end row -->
    <div class="row">
      <div class="col-xl-3 col-sm-6" v-for="(data, index) in pricingData" :key="index">
        <div class="card pricing-box">
          <div class="card-body p-4">
            <div class="text-center">
              <div class="mt-3">
                <i :class="`${data.icon} text-primary h1`"></i>
              </div>
              <h5 class="mt-4">{{data.title}}</h5>

              <div class="font-size-14 mt-4 pt-2">
                <ul class="list-unstyled plan-features">
                  <li>Free Live Support</li>
                  <li>Unlimited User</li>
                  <li>No Time Tracking</li>
                </ul>
              </div>

              <div class="mt-5">
                <h1 class="font-weight-bold mb-1">
                  <sup class="mr-1">
                    <small>$</small>
                  </sup>{{data.price}}
                </h1>
                <p class="text-muted">Per month</p>
              </div>

              <div class="mt-5 mb-3">
                <a href="#" class="btn btn-primary w-md">Get started</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>